package com.scanalytics.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/**
 * Mirrors Python: schemas.DashboardResponse
 * Response from GET /api/dashboard
 */
public class DashboardResponse {

    @JsonProperty("company_name")
    private String companyName;

    private List<Map<String, Object>> widgets;

    public DashboardResponse() {}

    public DashboardResponse(String companyName, List<Map<String, Object>> widgets) {
        this.companyName = companyName;
        this.widgets = widgets;
    }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public List<Map<String, Object>> getWidgets() { return widgets; }
    public void setWidgets(List<Map<String, Object>> widgets) { this.widgets = widgets; }
}
