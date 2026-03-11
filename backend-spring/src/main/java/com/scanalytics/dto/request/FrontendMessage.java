package com.scanalytics.dto.request;

import java.util.List;

/**
 * Mirrors Python: FrontendMessage (inline in main.py)
 */
public class FrontendMessage {

    private String role;
    private List<TextPart> parts;

    public FrontendMessage() {}

    public FrontendMessage(String role, List<TextPart> parts) {
        this.role = role;
        this.parts = parts;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<TextPart> getParts() { return parts; }
    public void setParts(List<TextPart> parts) { this.parts = parts; }
}
