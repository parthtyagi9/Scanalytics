package com.scanalytics.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scanalytics.dto.request.MetricSpec;
import com.scanalytics.dto.response.ChatResponse;
import com.scanalytics.dto.response.MetricProposal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.*;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Mirrors Python: ai_engine.py
 * 
 * Two agent functions:
 * 1. chatWithAnalyst() — Business Intelligence Consultant (chat & negotiation)
 * 2. generateInsights() — Data Architect (SQL generator)
 * 
 * Uses Spring AI ChatClient with OpenRouter as the LLM provider.
 */
@Service
public class AiEngineService {

    private static final Logger log = LoggerFactory.getLogger(AiEngineService.class);

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    // --- FALLBACK INSIGHTS (Safety Net — mirrors Python FALLBACK_INSIGHTS) ---
    private static final List<Map<String, String>> FALLBACK_INSIGHTS = List.of(
            Map.of(
                    "title", "Total Events Tracked",
                    "sql_query", "SELECT count(*) FROM analytics_events WHERE project_id = :project_id"
            ),
            Map.of(
                    "title", "Activity by Event Name",
                    "sql_query", "SELECT event_name, count(*) FROM analytics_events WHERE project_id = :project_id GROUP BY 1 ORDER BY 2 DESC LIMIT 5"
            )
    );

    @Autowired
    public AiEngineService(ChatClient chatClient) {
        this.chatClient = chatClient;
        this.objectMapper = new ObjectMapper();
    }

    // =========================================================================
    // AGENT 1: THE ANALYST (Chat with User)
    // Mirrors Python: chat_with_analyst()
    // =========================================================================
    public ChatResponse chatWithAnalyst(List<Map<String, String>> chatHistory) {
        String systemPrompt = """
            You are an advanced Business Intelligence Consultant integrated into a web application.
            Your goal is to interview the user to identify their business type and propose the perfect set of 3-5 analytics metrics (KPIs) for their dashboard.

            ### CORE BEHAVIOR
            1. **Identify Business Context:**
               - Analyze the user's description (e.g., "I sell shoes" -> E-Commerce).
               - If unclear, ask ONE clarifying question or make a reasonable assumption (e.g., "Assuming you are an online retailer...").

            2. **Apply Industry-Specific Intelligence (Do NOT be generic):**
               - **Financial/Investment:** Propose metrics like Returns, Volatility, Liquidity, Exposure.
               - **E-Commerce:** Propose Conversion Rates, CAC, Retention, Cart Abandonment.
               - **SaaS:** Propose MRR/ARR, Churn, NRR, Active Users.
               - **Manufacturing:** Propose Efficiency, Yield, Downtime, Supply Chain Costs.
               - **Content/Media:** Propose Engagement Time, DAU/MAU, Virality.

            3. **The Interaction Loop:**
               - **Phase 1 (Discovery):** If the user just says "Hi", ask what their business does.
               - **Phase 2 (Proposal):** Once you know the business, IMMEDIATELY propose 3-5 specific metrics in the `suggested_metrics` list. Explain *why* you chose them in `ai_message`.
               - **Phase 3 (Refinement):** If the user asks for changes (e.g., "I don't care about Churn"), update the `suggested_metrics` list instantly to reflect the new plan.
               - **Phase 4 (Agreement):** If the user says "Looks good", "Yes", or "Go ahead", set `is_ready_to_create` to `True`.

            ### OUTPUT RULES
            - **Terminology:** Use professional, industry-appropriate terms (e.g., "Inventory Turnover" instead of "How fast stock sells").
            - **Conciseness:** Be brief. Focus on the metrics.
            - **Structure:** You must strictly follow the JSON response format.
              - `ai_message`: The conversational text shown to the user.
              - `suggested_metrics`: The list of metrics you are currently proposing. Each with `name` and `description`.
              - `is_ready_to_create`: Boolean. Set to True ONLY when the user explicitly approves the plan.
            
            RESPOND ONLY WITH VALID JSON. No markdown, no code fences. Just the JSON object.
            Example format:
            {"ai_message": "...", "suggested_metrics": [{"name": "...", "description": "..."}], "is_ready_to_create": false}
            """;

        try {
            // Build message list from chat history
            List<Message> messages = new ArrayList<>();
            messages.add(new SystemMessage(systemPrompt));

            for (Map<String, String> msg : chatHistory) {
                String role = msg.get("role");
                String content = msg.get("content");
                if ("user".equals(role)) {
                    messages.add(new UserMessage(content));
                } else if ("assistant".equals(role)) {
                    messages.add(new AssistantMessage(content));
                }
            }

            Prompt prompt = new Prompt(messages);
            org.springframework.ai.chat.ChatResponse aiResponse = chatClient.call(prompt);
            String responseText = aiResponse.getResult().getOutput().getContent();

            // Parse the JSON response into ChatResponse
            return parseJsonChatResponse(responseText);

        } catch (Exception e) {
            log.error("Analyst Error: {}", e.getMessage());
            return new ChatResponse(
                    "I'm having trouble connecting. Let's stick to standard metrics.",
                    Collections.emptyList(),
                    false
            );
        }
    }

    // =========================================================================
    // AGENT 2: THE ENGINEER (SQL Generator)
    // Mirrors Python: generate_insights()
    // =========================================================================
    public List<Map<String, String>> generateInsights(
            String projectName,
            String projectDescription,
            List<Map<String, Object>> sampleEvents,
            List<MetricSpec> approvedMetrics
    ) {
        log.info("AI Engine: Analyzing {} events...", sampleEvents.size());

        if (sampleEvents.isEmpty()) {
            log.info("No events found. Returning fallback.");
            return FALLBACK_INSIGHTS;
        }

        String dataPreview;
        try {
            dataPreview = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(sampleEvents);
        } catch (JsonProcessingException e) {
            dataPreview = sampleEvents.toString();
        }

        // Build task instruction based on whether we have approved metrics
        String taskInstruction;
        if (approvedMetrics != null && !approvedMetrics.isEmpty()) {
            String planText = approvedMetrics.stream()
                    .map(m -> "- " + m.getName() + ": " + m.getDescription())
                    .collect(Collectors.joining("\n"));
            taskInstruction = """
                    STRICTLY generate SQL queries for these APPROVED METRICS:
                    %s
                    
                    Do not invent new metrics. Focus ONLY on implementing the list above.
                    """.formatted(planText);
        } else {
            taskInstruction = "Generate 3-4 interesting insights based on the data patterns you see.";
        }

        String systemPrompt = """
                You are a Data Architect (PostgreSQL + JSONB).
                CONTEXT: %s - %s
                TABLE: analytics_events (event_name, properties)
                SAMPLE DATA: %s
                
                TASK:
                %s
                
                RULES:
                1. Use PostgreSQL JSONB syntax (properties->>'key').
                2. Always filter by `WHERE project_id = :project_id`.
                3. Ensure SQL is valid and efficient.
                
                RESPOND ONLY WITH VALID JSON. No markdown, no code fences. Just the JSON object.
                Example format:
                {"insights": [{"title": "...", "sql_query": "SELECT ..."}]}
                """.formatted(projectName, projectDescription, dataPreview, taskInstruction);

        // Retry up to 2 times (mirrors Python max_retries=2)
        for (int attempt = 0; attempt < 2; attempt++) {
            try {
                List<Message> messages = List.of(
                        new SystemMessage(systemPrompt),
                        new UserMessage("Generate the dashboard configuration.")
                );
                Prompt prompt = new Prompt(messages);
                org.springframework.ai.chat.ChatResponse aiResponse = chatClient.call(prompt);
                String responseText = aiResponse.getResult().getOutput().getContent();

                List<Map<String, String>> insights = parseJsonInsights(responseText);
                if (insights != null && !insights.isEmpty()) {
                    log.info("AI Success! Returning generated insights.");
                    return insights;
                }
            } catch (Exception e) {
                log.error("AI attempt {} failed: {}", attempt + 1, e.getMessage());
            }
        }

        log.warn("AI FAILED after retries. Returning fallback insights.");
        return FALLBACK_INSIGHTS;
    }

    // =========================================================================
    // JSON Parsing Helpers
    // =========================================================================

    private ChatResponse parseJsonChatResponse(String responseText) {
        try {
            // Strip markdown code fences if present
            String cleaned = cleanJsonResponse(responseText);
            JsonNode root = objectMapper.readTree(cleaned);

            String aiMessage = root.has("ai_message") ? root.get("ai_message").asText() : "";
            boolean isReady = root.has("is_ready_to_create") && root.get("is_ready_to_create").asBoolean();

            List<MetricProposal> metrics = new ArrayList<>();
            if (root.has("suggested_metrics") && root.get("suggested_metrics").isArray()) {
                for (JsonNode node : root.get("suggested_metrics")) {
                    String name = node.has("name") ? node.get("name").asText() : "";
                    String desc = node.has("description") ? node.get("description").asText() : "";
                    metrics.add(new MetricProposal(name, desc));
                }
            }

            return new ChatResponse(aiMessage, metrics, isReady);
        } catch (Exception e) {
            log.error("Failed to parse chat response JSON: {}", e.getMessage());
            log.debug("Raw response: {}", responseText);
            return new ChatResponse(
                    responseText != null ? responseText : "I'm having trouble processing. Could you try again?",
                    Collections.emptyList(),
                    false
            );
        }
    }

    private List<Map<String, String>> parseJsonInsights(String responseText) {
        try {
            String cleaned = cleanJsonResponse(responseText);
            JsonNode root = objectMapper.readTree(cleaned);

            JsonNode insightsNode = root.has("insights") ? root.get("insights") : root;
            if (insightsNode.isArray()) {
                List<Map<String, String>> result = new ArrayList<>();
                for (JsonNode node : insightsNode) {
                    String title = node.has("title") ? node.get("title").asText() : "";
                    String sql = node.has("sql_query") ? node.get("sql_query").asText() : "";
                    if (!title.isEmpty() && !sql.isEmpty()) {
                        result.add(Map.of("title", title, "sql_query", sql));
                    }
                }
                return result;
            }
        } catch (Exception e) {
            log.error("Failed to parse insights JSON: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Strips markdown code fences and extra whitespace from LLM responses.
     */
    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        String cleaned = response.trim();
        // Remove markdown code fences like ```json ... ```
        if (cleaned.startsWith("```")) {
            int firstNewline = cleaned.indexOf('\n');
            if (firstNewline > 0) {
                cleaned = cleaned.substring(firstNewline + 1);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
        }
        return cleaned.trim();
    }
}
