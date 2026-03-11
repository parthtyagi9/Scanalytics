package com.scanalytics.controller;

import com.scanalytics.dto.response.DashboardResponse;
import com.scanalytics.model.Project;
import com.scanalytics.security.ApiKeyInterceptor;
import com.scanalytics.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Mirrors Python: GET /api/dashboard endpoint in main.py
 * Requires X-Api-Key authentication (handled by ApiKeyInterceptor).
 */
@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(HttpServletRequest request) {
        Project project = (Project) request.getAttribute(ApiKeyInterceptor.PROJECT_ATTRIBUTE);
        DashboardResponse dashboard = dashboardService.getDashboard(project);
        return ResponseEntity.ok(dashboard);
    }
}
