package com.scanalytics.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Mirrors Python: ai_engine.ChatResponse
 * Response from POST /api/chat-analyst
 */
public class ChatResponse {

    @JsonProperty("ai_message")
    private String aiMessage;

    @JsonProperty("suggested_metrics")
    private List<MetricProposal> suggestedMetrics;

    @JsonProperty("is_ready_to_create")
    private boolean isReadyToCreate;

    public ChatResponse() {}

    public ChatResponse(String aiMessage, List<MetricProposal> suggestedMetrics, boolean isReadyToCreate) {
        this.aiMessage = aiMessage;
        this.suggestedMetrics = suggestedMetrics;
        this.isReadyToCreate = isReadyToCreate;
    }

    public String getAiMessage() { return aiMessage; }
    public void setAiMessage(String aiMessage) { this.aiMessage = aiMessage; }

    public List<MetricProposal> getSuggestedMetrics() { return suggestedMetrics; }
    public void setSuggestedMetrics(List<MetricProposal> suggestedMetrics) { this.suggestedMetrics = suggestedMetrics; }

    public boolean isReadyToCreate() { return isReadyToCreate; }
    public void setReadyToCreate(boolean readyToCreate) { isReadyToCreate = readyToCreate; }
}
