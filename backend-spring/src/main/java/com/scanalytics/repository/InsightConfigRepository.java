package com.scanalytics.repository;

import com.scanalytics.model.InsightConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Repository
public interface InsightConfigRepository extends JpaRepository<InsightConfig, UUID> {

    List<InsightConfig> findByProjectId(UUID projectId);

    @Transactional
    void deleteByProjectId(UUID projectId);
}
