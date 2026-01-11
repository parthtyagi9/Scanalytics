from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db, engine 
import models, schemas
import uuid
from ai_engine import generate_insights, chat_with_analyst
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

# --- CRITICAL FIX: ENABLE EXTENSION FIRST ---
with engine.connect() as connection:
    connection.commit() 
    connection.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
    connection.commit()

models.Base.metadata.create_all(bind=engine)
app = FastAPI()
# --------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for hackathons)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)


# --- NEW: SCHEMAS TO MATCH YOUR FRONTEND JSON ---
class TextPart(BaseModel):
    type: str
    text: str

class FrontendMessage(BaseModel):
    role: str # "user" or "assistant"
    parts: List[TextPart] # The nested structure you showed me

class ChatRequest(BaseModel):
    # This matches the {"id": "...", "messages": [...], "trigger": "..."} format
    id: Optional[str] = None
    trigger: Optional[str] = None 
    messages: List[FrontendMessage]

# --- 0. THE ANALYST CHAT ENDPOINT (UPDATED) ---
@app.post("/api/chat-analyst")
def chat_analyst(request: ChatRequest):
    try:
        # --- PARSING LOGIC: Frontend JSON -> OpenAI Format ---
        clean_history = []
        
        for msg in request.messages:
            # Join all text parts together (in case there are multiple)
            full_text = "".join([p.text for p in msg.parts if p.type == 'text'])
            
            # Map "model" role to "assistant" if your frontend sends "model"
            role = "assistant" if msg.role == "model" else msg.role
            
            clean_history.append({"role": role, "content": full_text})
        
        # Now pass the clean list to the engine
        response_data = chat_with_analyst(clean_history)
        return response_data
        
    except Exception as e:
        print(f"Chat Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- 1. ONBOARDING ENDPOINT ---
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
        {"name": "cart_checkout", "props": {"amount": 45.50, "items": 3}},
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

    # --- 3. DEMO MAGIC: AUTO-TRIGGER AI ---
    print(f"🧠 DEMO MODE: Triggering AI Analysis...")
    
    recent_events = db.query(models.Event).filter(
        models.Event.project_id == new_project.id
    ).limit(20).all()
    
    sample_data = [{"event": e.event_name, "props": e.properties} for e in recent_events]
    
    # Check if approved metrics exist and convert them
    approved_metrics_dicts = []
    if project_data.approved_metrics:
        approved_metrics_dicts = [m.model_dump() for m in project_data.approved_metrics]

    ai_insights = generate_insights(
        new_project.name, 
        new_project.description, 
        sample_data,
        approved_metrics_dicts
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

# --- 4. MANUAL TRIGGER (Optional) ---
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