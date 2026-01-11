from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func, text
from database import Base

class Project(Base):
    __tablename__ = "projects"
    
    # We use server_default to let Postgres generate the UUIDs
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    name = Column(String)
    description = Column(Text)
    api_key = Column(String, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Event(Base):
    __tablename__ = "analytics_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"))
    event_name = Column(String)
    
    # This stores the custom JSON data (e.g., {"cat_breed": "Siamese"})
    properties = Column(JSONB)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InsightConfig(Base):
    __tablename__ = "insights_config"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"))
    insight_title = Column(String)
    sql_query = Column(Text) # The AI writes SQL and saves it here
    created_at = Column(DateTime(timezone=True), server_default=func.now())