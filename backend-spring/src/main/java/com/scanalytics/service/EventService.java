package com.scanalytics.service;

import com.scanalytics.model.AnalyticsEvent;
import com.scanalytics.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/**
 * Mirrors Python: POST /api/track handler logic
 */
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public void trackEvent(UUID projectId, String eventName, Map<String, Object> properties) {
        AnalyticsEvent event = new AnalyticsEvent(projectId, eventName, properties);
        eventRepository.save(event);
    }
}
