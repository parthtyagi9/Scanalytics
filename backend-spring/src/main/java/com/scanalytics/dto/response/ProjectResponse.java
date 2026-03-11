package com.scanalytics.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Mirrors Python: schemas.ProjectResponse
 * Response from POST /api/onboarding
 */
public class ProjectResponse {

    @JsonProperty("project_id")
    private String projectId;

    @JsonProperty("api_key")
    private String apiKey;

    @JsonProperty("sdk_snippet")
    private String sdkSnippet;

    public ProjectResponse() {}

    public ProjectResponse(String projectId, String apiKey, String sdkSnippet) {
        this.projectId = projectId;
        this.apiKey = apiKey;
        this.sdkSnippet = sdkSnippet;
    }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getSdkSnippet() { return sdkSnippet; }
    public void setSdkSnippet(String sdkSnippet) { this.sdkSnippet = sdkSnippet; }
}
