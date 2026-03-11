package com.scanalytics.service;

import com.scanalytics.dto.request.MetricSpec;
import com.scanalytics.dto.response.ProjectResponse;
import com.scanalytics.model.AnalyticsEvent;
import com.scanalytics.model.InsightConfig;
import com.scanalytics.model.Project;
import com.scanalytics.repository.EventRepository;
import com.scanalytics.repository.InsightConfigRepository;
import com.scanalytics.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Mirrors Python: onboarding logic in main.py create_project()
 */
@Service
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private InsightConfigRepository insightConfigRepository;

    @Autowired
    private AiEngineService aiEngineService;

    /**
     * Mirrors Python: POST /api/onboarding handler
     * 1. Creates project with generated API key
     * 2. Generates 30 random demo events
     * 3. Triggers AI analysis
     * 4. Saves insight configs
     */
    @Transactional
    public ProjectResponse createProject(String name, String description, List<MetricSpec> approvedMetrics) {
        // 1. Create Project
        String newApiKey = "key-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        Project project = new Project(name, description, newApiKey);
        project = projectRepository.save(project);

        // 2. Demo Data Generation (mirrors Python demo_events)
        log.info("Generating fake data for {}...", project.getName());
        List<Map<String, Object>> demoEventTemplates = List.of(
                Map.of("name", "video_play", "props", Map.of("title", "Demo Video A", "duration", 120, "user_type", "free")),
                Map.of("name", "video_play", "props", Map.of("title", "Demo Video B", "duration", 300, "user_type", "premium")),
                Map.of("name", "subscription", "props", Map.of("plan", "premium", "price", 19.99)),
                Map.of("name", "error", "props", Map.of("code", 500, "message", "Crash")),
                Map.of("name", "cart_checkout", "props", Map.of("amount", 45.50, "items", 3))
        );

        Random random = new Random();
        for (int i = 0; i < 30; i++) {
            Map<String, Object> evt = demoEventTemplates.get(random.nextInt(demoEventTemplates.size()));
            @SuppressWarnings("unchecked")
            Map<String, Object> props = (Map<String, Object>) evt.get("props");
            AnalyticsEvent event = new AnalyticsEvent(
                    project.getId(),
                    (String) evt.get("name"),
                    new HashMap<>(props)
            );
            eventRepository.save(event);
        }

        // 3. AI Analysis
        log.info("Triggering AI Analysis...");
        List<AnalyticsEvent> recentEvents = eventRepository
                .findByProjectIdOrderByCreatedAtDesc(project.getId(), PageRequest.of(0, 20));

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
                approvedMetrics
        );

        // 4. Save insight configs
        for (Map<String, String> insight : aiInsights) {
            String sql = insight.get("sql_query");
            if (!sql.contains(":project_id")) {
                sql += " WHERE project_id = :project_id";
            }
            InsightConfig config = new InsightConfig(project.getId(), insight.get("title"), sql);
            insightConfigRepository.save(config);
        }

        return new ProjectResponse(
                project.getId().toString(),
                project.getApiKey(),
                "import { init } from 'analytics';\ninit('" + newApiKey + "');"
        );
    }
}
