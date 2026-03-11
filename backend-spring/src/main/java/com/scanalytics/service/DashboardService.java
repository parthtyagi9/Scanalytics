package com.scanalytics.service;

import com.scanalytics.dto.response.DashboardResponse;
import com.scanalytics.model.AnalyticsEvent;
import com.scanalytics.model.InsightConfig;
import com.scanalytics.model.Project;
import com.scanalytics.repository.EventRepository;
import com.scanalytics.repository.InsightConfigRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Mirrors Python: GET /api/dashboard and POST /api/generate-insights handler logic
 */
@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);

    @Autowired
    private InsightConfigRepository insightConfigRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AiEngineService aiEngineService;

    @Autowired
    private EntityManager entityManager;

    /**
     * Mirrors Python: GET /api/dashboard
     * Loads insight configs, executes each SQL query, builds widget list.
     */
    public DashboardResponse getDashboard(Project project) {
        List<InsightConfig> configs = insightConfigRepository.findByProjectId(project.getId());
        List<Map<String, Object>> widgets = new ArrayList<>();

        for (InsightConfig config : configs) {
            try {
                Query query = entityManager.createNativeQuery(config.getSqlQuery());
                query.setParameter("project_id", project.getId().toString());

                @SuppressWarnings("unchecked")
                List<Object[]> results = query.getResultList();

                List<Map<String, Object>> formattedData = new ArrayList<>();

                // Handle single-column results (e.g., SELECT count(*))
                if (!results.isEmpty()) {
                    Object firstResult = results.get(0);
                    if (firstResult instanceof Object[] row) {
                        for (Object[] r : results) {
                            formattedData.add(Map.of(
                                    "label", String.valueOf(r[0]),
                                    "value", r[1]
                            ));
                        }
                    } else {
                        // Single value result (e.g., count(*))
                        formattedData.add(Map.of(
                                "label", config.getInsightTitle(),
                                "value", firstResult
                        ));
                    }
                }

                // Determine widget type (mirrors Python logic)
                String widgetType = "bar_chart";
                Object widgetData = formattedData;

                if (formattedData.size() == 1) {
                    String titleLower = config.getInsightTitle().toLowerCase();
                    if (titleLower.contains("avg") || titleLower.contains("total") || titleLower.contains("count")) {
                        widgetData = formattedData.get(0).get("value");
                        widgetType = "stat_card";
                    }
                }

                Map<String, Object> widget = new LinkedHashMap<>();
                widget.put("title", config.getInsightTitle());
                widget.put("type", widgetType);
                widget.put("data", widgetData);
                widgets.add(widget);

            } catch (Exception e) {
                log.error("Query Error for '{}': {}", config.getInsightTitle(), e.getMessage());
                continue;
            }
        }

        return new DashboardResponse(project.getName(), widgets);
    }

    /**
     * Mirrors Python: POST /api/generate-insights
     * Fetches sample events, calls AI, replaces insight configs.
     */
    @Transactional
    public Map<String, String> regenerateInsights(Project project) {
        List<AnalyticsEvent> recentEvents = eventRepository
                .findByProjectIdOrderByCreatedAtDesc(project.getId(), PageRequest.of(0, 20));

        if (recentEvents.isEmpty()) {
            return Map.of("status", "error", "message", "No data found.");
        }

        List<Map<String, Object>> sampleData = recentEvents.stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("event", e.getEventName());
                    m.put("props", e.getProperties());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, String>> aiInsights = aiEngineService.generateInsights(
                project.getName(),
                project.getDescription(),
                sampleData,
                null // no approved metrics for manual trigger
        );

        // Delete old configs and save new ones
        insightConfigRepository.deleteByProjectId(project.getId());

        for (Map<String, String> insight : aiInsights) {
            String sql = insight.get("sql_query");
            if (!sql.contains(":project_id")) {
                sql += " WHERE project_id = :project_id";
            }
            InsightConfig config = new InsightConfig(project.getId(), insight.get("title"), sql);
            insightConfigRepository.save(config);
        }

        return Map.of("status", "success", "message", "Insights updated");
    }
}
