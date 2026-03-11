package com.scanalytics.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mirrors Python: ai_engine.MetricProposal
 */
public class MetricProposal {

    private String name;
    private String description;

    public MetricProposal() {}

    public MetricProposal(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
