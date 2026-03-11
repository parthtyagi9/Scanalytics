package com.scanalytics.seed;

import com.scanalytics.model.AnalyticsEvent;
import com.scanalytics.model.Project;
import com.scanalytics.repository.EventRepository;
import com.scanalytics.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Mirrors Python: seed_data.py
 * 
 * Seeds "Tony Pizza Shop" with 10 specific events.
 * Only runs when the "seed" profile is active:
 *   mvn spring-boot:run -Dspring-boot.run.profiles=seed
 * 
 * Uses ON CONFLICT-equivalent logic (check if exists before insert).
 */
@Component
@Profile("seed")
public class SeedDataRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedDataRunner.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EventRepository eventRepository;

    // Hardcoded UUID matching seed_data.py
    private static final UUID PIZZA_PROJECT_ID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

    @Override
    public void run(String... args) {
        log.info("Running seed data...");

        // 1. Create project if not exists (mirrors ON CONFLICT DO NOTHING)
        if (projectRepository.findById(PIZZA_PROJECT_ID).isEmpty()) {
            Project pizza = new Project("Tony Pizza Shop", "Dine-in/Delivery analytics", "pizza-key-123");
            pizza.setId(PIZZA_PROJECT_ID);
            projectRepository.save(pizza);
            log.info("Created project: Tony Pizza Shop");
        } else {
            log.info("Project Tony Pizza Shop already exists, skipping.");
        }

        // 2. Insert 10 events (mirrors seed_data.py events list)
        List<Object[]> events = List.of(
                new Object[]{"order_completed", Map.of("revenue", 34.50, "cost", 6.21, "type", "dine_in")},
                new Object[]{"order_completed", Map.of("revenue", 42.00, "cost", 7.56, "type", "delivery")},
                new Object[]{"order_completed", Map.of("revenue", 28.00, "cost", 5.04, "type", "dine_in")},
                new Object[]{"order_completed", Map.of("revenue", 55.00, "cost", 9.90, "type", "delivery")},
                new Object[]{"delivery_dispatched", Map.of("time_minutes", 48)},
                new Object[]{"delivery_dispatched", Map.of("time_minutes", 52)},
                new Object[]{"delivery_dispatched", Map.of("time_minutes", 44)},
                new Object[]{"user_session", Map.of("user_id", "cust_1", "is_returning", true)},
                new Object[]{"user_session", Map.of("user_id", "cust_2", "is_returning", false)},
                new Object[]{"user_session", Map.of("user_id", "cust_1", "is_returning", true)}
        );

        for (Object[] evt : events) {
            String eventName = (String) evt[0];
            @SuppressWarnings("unchecked")
            Map<String, Object> props = (Map<String, Object>) evt[1];
            AnalyticsEvent event = new AnalyticsEvent(PIZZA_PROJECT_ID, eventName, new HashMap<>(props));
            eventRepository.save(event);
        }

        log.info("Success: Seeded Pizza Shop data with 10 events!");
    }
}
