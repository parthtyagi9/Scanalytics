package com.scanalytics.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Mirrors Python: ChatRequest (inline in main.py)
 * Request body for POST /api/chat-analyst
 */
public class ChatRequest {

    private String id;
    private String trigger;
    private List<FrontendMessage> messages;

    public ChatRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTrigger() { return trigger; }
    public void setTrigger(String trigger) { this.trigger = trigger; }

    public List<FrontendMessage> getMessages() { return messages; }
    public void setMessages(List<FrontendMessage> messages) { this.messages = messages; }
}
