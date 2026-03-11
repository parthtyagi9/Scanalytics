package com.scanalytics.controller;

import com.scanalytics.dto.request.EventCreateRequest;
import com.scanalytics.model.Project;
import com.scanalytics.security.ApiKeyInterceptor;
import com.scanalytics.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Mirrors Python: POST /api/track endpoint in main.py
 * Requires X-Api-Key authentication (handled by ApiKeyInterceptor).
 */
@RestController
@RequestMapping("/api")
public class TrackController {

    @Autowired
    private EventService eventService;

    @PostMapping("/track")
    public ResponseEntity<Map<String, String>> trackEvent(
            @RequestBody EventCreateRequest eventData,
            HttpServletRequest request
    ) {
        Project project = (Project) request.getAttribute(ApiKeyInterceptor.PROJECT_ATTRIBUTE);
        eventService.trackEvent(project.getId(), eventData.getEventName(), eventData.getProperties());
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}
