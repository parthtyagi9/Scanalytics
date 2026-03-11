package com.scanalytics.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

/**
 * Mirrors Python: schemas.EventCreate
 * Request body for POST /api/track
 */
public class EventCreateRequest {

    @JsonProperty("event_name")
    private String eventName;

    private Map<String, Object> properties;

    public EventCreateRequest() {}

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) { this.properties = properties; }
}
