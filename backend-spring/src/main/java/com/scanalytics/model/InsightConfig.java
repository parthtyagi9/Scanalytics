package com.scanalytics.model;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Mirrors Python: models.InsightConfig
 * Table: insights_config
 * 
 * Includes threshold_condition and last_run_at columns from schema.sql
 * (these were missing from the Python ORM model - fixing the schema drift).
 */
@Entity
@Table(name = "insights_config")
public class InsightConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "insight_title")
    private String insightTitle;

    @Column(name = "sql_query", nullable = false, columnDefinition = "TEXT")
    private String sqlQuery;

    @Column(name = "threshold_condition", columnDefinition = "TEXT")
    private String thresholdCondition;

    @Column(name = "last_run_at")
    private OffsetDateTime lastRunAt;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    // --- Constructors ---
    public InsightConfig() {}

    public InsightConfig(UUID projectId, String insightTitle, String sqlQuery) {
        this.projectId = projectId;
        this.insightTitle = insightTitle;
        this.sqlQuery = sqlQuery;
    }

    // --- Getters & Setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }

    public String getInsightTitle() { return insightTitle; }
    public void setInsightTitle(String insightTitle) { this.insightTitle = insightTitle; }

    public String getSqlQuery() { return sqlQuery; }
    public void setSqlQuery(String sqlQuery) { this.sqlQuery = sqlQuery; }

    public String getThresholdCondition() { return thresholdCondition; }
    public void setThresholdCondition(String thresholdCondition) { this.thresholdCondition = thresholdCondition; }

    public OffsetDateTime getLastRunAt() { return lastRunAt; }
    public void setLastRunAt(OffsetDateTime lastRunAt) { this.lastRunAt = lastRunAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
