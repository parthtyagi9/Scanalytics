package com.scanalytics.security;

import com.scanalytics.model.Project;
import com.scanalytics.repository.ProjectRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;

/**
 * Mirrors Python: x_api_key header validation in main.py endpoints.
 * 
 * Applied to: /api/track, /api/dashboard, /api/generate-insights
 * Reads the X-Api-Key header and validates against the projects table.
 * On success, stores the Project in request attributes for controllers to use.
 */
@Component
public class ApiKeyInterceptor implements HandlerInterceptor {

    public static final String PROJECT_ATTRIBUTE = "authenticatedProject";

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow CORS preflight requests through
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String apiKey = request.getHeader("X-Api-Key");
        if (apiKey == null || apiKey.isBlank()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"detail\":\"Invalid API Key\"}");
            return false;
        }

        Optional<Project> project = projectRepository.findByApiKey(apiKey);
        if (project.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"detail\":\"Invalid API Key\"}");
            return false;
        }

        // Store project in request for downstream controllers
        request.setAttribute(PROJECT_ATTRIBUTE, project.get());
        return true;
    }
}
