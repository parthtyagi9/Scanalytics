package com.scanalytics.controller;

import com.scanalytics.model.Project;
import com.scanalytics.security.ApiKeyInterceptor;
import com.scanalytics.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Mirrors Python: POST /api/generate-insights endpoint in main.py
 * Requires X-Api-Key authentication (handled by ApiKeyInterceptor).
 */
@RestController
@RequestMapping("/api")
public class InsightsController {

    @Autowired
    private DashboardService dashboardService;

    @PostMapping("/generate-insights")
    public ResponseEntity<Map<String, String>> generateInsights(HttpServletRequest request) {
        Project project = (Project) request.getAttribute(ApiKeyInterceptor.PROJECT_ATTRIBUTE);
        Map<String, String> result = dashboardService.regenerateInsights(project);
        return ResponseEntity.ok(result);
    }
}
