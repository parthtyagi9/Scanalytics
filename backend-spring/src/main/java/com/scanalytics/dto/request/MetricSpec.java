package com.scanalytics.dto.request;

/**
 * Mirrors Python: schemas.MetricSpec
 */
public class MetricSpec {

    private String name;
    private String description;

    public MetricSpec() {}

    public MetricSpec(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
