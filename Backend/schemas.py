#just to keep the data clean
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class ProjectCreate(BaseModel):
    name: str
    description: str

class ProjectResponse(BaseModel):
    project_id: str
    api_key: str
    sdk_snippet: Optional[str] = None

class EventCreate(BaseModel):
    event_name: str
    properties: Dict[str, Any]

class WidgetData(BaseModel):
    title: str
    type: str
    data: Any

class DashboardResponse(BaseModel):
    company_name: str
    widgets: List[WidgetData]