import os
import json
import instructor
from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

# --- 1. DEMO INSURANCE (The Safety Net) ---
FALLBACK_INSIGHTS = [
    {
        "title": "Total Events Tracked",
        "sql_query": "SELECT count(*) FROM analytics_events WHERE project_id = :project_id"
    },
    {
        "title": "Activity by Event Name",
        "sql_query": "SELECT event_name, count(*) FROM analytics_events WHERE project_id = :project_id GROUP BY 1 ORDER BY 2 DESC LIMIT 5"
    }
]

# --- 2. DATA STRUCTURES ---

# STRUCTURE A: For the "Engineer" (Final SQL Output)
class Insight(BaseModel):
    title: str = Field(..., description="Short title (e.g., 'Daily Active Users')")
    sql_query: str = Field(..., description="PostgreSQL JSONB query. MUST use :project_id parameter.")

class DashboardConfig(BaseModel):
    insights: List[Insight]

# STRUCTURE B: For the "Analyst" (Chat & Negotiation)
class MetricProposal(BaseModel):
    name: str = Field(..., description="Name of the metric (e.g., 'Retention Rate')")
    description: str = Field(..., description="What this measures")

class ChatResponse(BaseModel):
    ai_message: str = Field(..., description="Polite, professional response to the user.")
    suggested_metrics: List[MetricProposal] = Field(..., description="The current list of proposed metrics based on the conversation.")
    is_ready_to_create: bool = Field(..., description="Set to True ONLY if the user has explicitly agreed to the plan.")

# --- 3. SETUP CLIENT ---
client = instructor.from_openai(
    OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
        default_headers={
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "DeltaHacks Analytics",
        }
    ),
    mode=instructor.Mode.JSON
)

MODEL = os.getenv("AI_MODEL", "google/gemini-2.0-flash-thinking-exp:free")

# --- 4. THE ANALYST AGENT (Chat Window) ---
def chat_with_analyst(chat_history: List[dict]) -> dict:
    """
    Discusses business needs with the user and proposes a metric plan.
    """
    system_prompt = """
    You are an expert Business Intelligence Analyst. 
    Your goal is to help the user define 3-5 key analytics metrics for their business.
    
    1. Ask clarifying questions if the user's description is vague.
    2. Propose specific, actionable metrics based on their industry (e.g., for E-commerce: Cart Abandonment, AOV).
    3. Be concise and professional.
    4. ALWAYS update the 'suggested_metrics' list to reflect the current agreed-upon plan.
    5. If the user says "looks good", "go ahead", or agrees to the metrics, set 'is_ready_to_create' to True.
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            response_model=ChatResponse,
            messages=[{"role": "system", "content": system_prompt}] + chat_history,
            max_retries=2
        )
        return response.model_dump()
    except Exception as e:
        print(f"Analyst Error: {e}")
        # Fallback response if AI fails during chat
        return {
            "ai_message": "I'm having trouble connecting to my brain. Let's try sticking to standard metrics.",
            "suggested_metrics": [],
            "is_ready_to_create": False
        }

# --- 5. THE ENGINEER AGENT (SQL Generator) ---
def generate_insights(project_name: str, project_description: str, sample_events: list, approved_metrics: list = None) -> List[dict]:
    """
    Takes the Data + The Plan (approved_metrics) -> Returns SQL.
    """
    print(f"AI Engine: Analyzing {len(sample_events)} events...")

    if not sample_events:
        print("No events found. Returning fallback.")
        return FALLBACK_INSIGHTS

    data_preview = json.dumps(sample_events, indent=2)

    # DYNAMIC PROMPT: If we have a plan, follow it. If not, improvise.
    if approved_metrics and len(approved_metrics) > 0:
        plan_text = "\n".join([f"- {m['name']}: {m['description']}" for m in approved_metrics])
        task_instruction = f"""
        STRICTLY generate SQL queries for these APPROVED METRICS:
        {plan_text}
        
        Do not invent new metrics. Focus ONLY on implementing the list above.
        """
    else:
        task_instruction = "Generate 3-4 interesting insights based on the data patterns you see."

    system_prompt = f"""
    You are a Data Architect (PostgreSQL + JSONB).
    CONTEXT: {project_name} - {project_description}
    TABLE: analytics_events (event_name, properties)
    SAMPLE DATA: {data_preview}
    
    TASK:
    {task_instruction}
    
    RULES: 
    1. Use PostgreSQL JSONB syntax (properties->>'key'). 
    2. Always filter by `WHERE project_id = :project_id`.
    3. Ensure SQL is valid and efficient.
    """

    try:
        response = client.chat.completions.create(
            model=MODEL,
            response_model=DashboardConfig,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the dashboard configuration."}
            ],
            max_retries=2, 
        )
        
        print("AI Success! Returning generated insights.")
        return [insight.model_dump() for insight in response.insights]
        
    except Exception as e:
        print(f"AI FAILED: {e}")
        return FALLBACK_INSIGHTS