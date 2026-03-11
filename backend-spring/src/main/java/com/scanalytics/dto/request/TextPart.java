package com.scanalytics.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mirrors Python: TextPart (inline in main.py)
 */
public class TextPart {

    private String type;
    private String text;

    public TextPart() {}

    public TextPart(String type, String text) {
        this.type = type;
        this.text = text;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
