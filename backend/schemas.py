#just to keep the data clean
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class MetricSpec(BaseModel):
    name: str
    description: str

class ProjectCreate(BaseModel):
    name: str
    description: str
    # --- NEW FIELD ---
    approved_metrics: List[MetricSpec] = [] 

class ProjectResponse(BaseModel):
    project_id: str
    api_key: str
    sdk_snippet: str

class EventCreate(BaseModel):
    event_name: str
    properties: Dict[str, Any]

class WidgetData(BaseModel):
    label: str
    value: float | int

class DashboardResponse(BaseModel):
    company_name: str
    widgets: List[Dict[str, Any]]