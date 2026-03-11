package com.scanalytics.controller;

import com.scanalytics.dto.request.ProjectCreateRequest;
import com.scanalytics.dto.response.ProjectResponse;
import com.scanalytics.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Mirrors Python: POST /api/onboarding endpoint in main.py
 * No authentication required.
 */
@RestController
@RequestMapping("/api")
public class OnboardingController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/onboarding")
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectCreateRequest request) {
        ProjectResponse response = projectService.createProject(
                request.getName(),
                request.getDescription(),
                request.getApprovedMetrics()
        );
        return ResponseEntity.ok(response);
    }
}
