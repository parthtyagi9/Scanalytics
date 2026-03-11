package com.scanalytics.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

/**
 * Mirrors Python: schemas.ProjectCreate
 * Request body for POST /api/onboarding
 */
public class ProjectCreateRequest {

    private String name;
    private String description;

    @JsonProperty("approved_metrics")
    private List<MetricSpec> approvedMetrics = new ArrayList<>();

    public ProjectCreateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<MetricSpec> getApprovedMetrics() { return approvedMetrics; }
    public void setApprovedMetrics(List<MetricSpec> approvedMetrics) { this.approvedMetrics = approvedMetrics; }
}
