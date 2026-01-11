from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db, engine 
import models, schemas
import uuid
# Import both agents
from ai_engine import generate_insights, chat_with_analyst
from typing import List, Dict, Any
from pydantic import BaseModel
import random

# --- CRITICAL FIX: ENABLE EXTENSION FIRST ---
with engine.connect() as connection:
    connection.commit() 
    connection.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
    connection.commit()

models.Base.metadata.create_all(bind=engine)
# --------------------------------------------

app = FastAPI()

# --- NEW: CHAT ENDPOINT REQUEST MODEL ---
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]] # e.g. [{"role": "user", "content": "Hi"}]

# --- 0. THE ANALYST CHAT ENDPOINT ---
@app.post("/api/chat-analyst")
def chat_analyst(request: ChatRequest):
    """
    Frontend calls this to talk to the AI Analyst.
    Returns: { ai_message, suggested_metrics, is_ready_to_create }
    """
    try:
        # Pass the conversation history to the AI
        response_data = chat_with_analyst(request.messages)
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 1. ONBOARDING ENDPOINT (Accepts Metrics Plan) ---
@app.post("/api/onboarding", response_model=schemas.ProjectResponse)
def create_project(project_data: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # 1. Create the Project
    new_api_key = f"key-{uuid.uuid4().hex[:8]}"
    
    new_project = models.Project(
        name=project_data.name,
        description=project_data.description,
        api_key=new_api_key
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # --- 2. DEMO MAGIC: AUTO-GENERATE DATA ---
    print(f"✨ DEMO MODE: Generating fake data for {new_project.name}...")
    
    demo_events = [
        {"name": "video_play", "props": {"title": "Demo Video A", "duration": 120, "user_type": "free"}},
        {"name": "video_play", "props": {"title": "Demo Video B", "duration": 300, "user_type": "premium"}},
        {"name": "subscription", "props": {"plan": "premium", "price": 19.99}},
        {"name": "error", "props": {"code": 500, "message": "Crash"}},
        {"name": "cart_checkout", "props": {"amount": 45.50, "items": 3}}, # Added variety for chat demo
    ]

    for _ in range(30):
        evt = random.choice(demo_events)
        db_event = models.Event(
            project_id=new_project.id,
            event_name=evt["name"],
            properties=evt["props"]
        )
        db.add(db_event)
    db.commit()

    # --- 3. DEMO MAGIC: AUTO-TRIGGER AI (With The Plan!) ---
    print(f"🧠 DEMO MODE: Triggering AI Analysis...")
    
    recent_events = db.query(models.Event).filter(
        models.Event.project_id == new_project.id
    ).limit(20).all()
    
    sample_data = [{"event": e.event_name, "props": e.properties} for e in recent_events]
    
    # --- CRITICAL CHANGE: Pass the 'approved_metrics' to the AI ---
    # Convert Pydantic models to list of dicts if they exist
    approved_metrics_dicts = []
    if project_data.approved_metrics:
        approved_metrics_dicts = [m.model_dump() for m in project_data.approved_metrics]

    ai_insights = generate_insights(
        new_project.name, 
        new_project.description, 
        sample_data,
        approved_metrics_dicts # <--- The plan from the chat goes here
    )
    
    for insight in ai_insights:
        sql = insight['sql_query']
        if ":project_id" not in sql:
            sql += " WHERE project_id = :project_id"
            
        new_config = models.InsightConfig(
            project_id=new_project.id,
            insight_title=insight['title'],
            sql_query=sql
        )
        db.add(new_config)
    db.commit()
    
    print("✅ DEMO SETUP COMPLETE.")

    return {
        "project_id": str(new_project.id),
        "api_key": new_project.api_key,
        "sdk_snippet": f"// SDK for {project_data.name}\nimport {{ init }} from 'analytics';\ninit('{new_api_key}');"
    }

# --- 2. INGESTION ENDPOINT ---
@app.post("/api/track")
def track_event(
    event_data: schemas.EventCreate, 
    x_api_key: str = Header(None), 
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.api_key == x_api_key).first()
    if not project:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    new_event = models.Event(
        project_id=project.id,
        event_name=event_data.event_name,
        properties=event_data.properties
    )
    db.add(new_event)
    db.commit()
    return {"status": "success"}

# --- 3. DASHBOARD ENDPOINT ---
@app.get("/api/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(x_api_key: str = Header(None), db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.api_key == x_api_key).first()
    if not project:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    configs = db.query(models.InsightConfig).filter(models.InsightConfig.project_id == project.id).all()
    
    widgets = []
    
    for config in configs:
        try:
            result = db.execute(
                text(config.sql_query), 
                {"project_id": str(project.id)}
            ).fetchall()
            
            formatted_data = [{"label": str(row[0]), "value": row[1]} for row in result]
            
            if len(formatted_data) == 1 and ("avg" in config.insight_title.lower() or "total" in config.insight_title.lower()):
                formatted_data = formatted_data[0]['value'] 
                widget_type = "stat_card"
            else:
                widget_type = "bar_chart"

            widgets.append({
                "title": config.insight_title,
                "type": widget_type,
                "data": formatted_data
            })
        except Exception as e:
            print(f"Query failed for {config.insight_title}: {e}")
            continue

    return {
        "company_name": project.name,
        "widgets": widgets
    }

# --- 4. GENERATE INSIGHTS (Manual Trigger) ---
@app.post("/api/generate-insights")
def trigger_ai_analysis(x_api_key: str = Header(None), db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.api_key == x_api_key).first()
    if not project:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    recent_events = db.query(models.Event).filter(
        models.Event.project_id == project.id
    ).order_by(models.Event.created_at.desc()).limit(20).all()

    if not recent_events:
        return {"status": "error", "message": "No data found. Send some events first!"}

    sample_data = [{"event": e.event_name, "props": e.properties} for e in recent_events]

    print(f"Asking Gemini to analyze {len(sample_data)} events for {project.name}...")
    ai_insights = generate_insights(project.name, project.description, sample_data)

    db.query(models.InsightConfig).filter(models.InsightConfig.project_id == project.id).delete()
    
    for insight in ai_insights:
        sql = insight['sql_query']
        if ":project_id" not in sql:
            sql += " WHERE project_id = :project_id"
            
        new_config = models.InsightConfig(
            project_id=project.id,
            insight_title=insight['title'],
            sql_query=sql
        )
        db.add(new_config)
    
    db.commit()

    return {
        "status": "success", 
        "message": f"Generated {len(ai_insights)} insights", 
        "insights": ai_insights
    }