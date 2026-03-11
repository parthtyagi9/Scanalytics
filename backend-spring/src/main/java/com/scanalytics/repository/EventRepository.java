package com.scanalytics.repository;

import com.scanalytics.model.AnalyticsEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<AnalyticsEvent, UUID> {

    List<AnalyticsEvent> findByProjectId(UUID projectId);

    List<AnalyticsEvent> findByProjectIdOrderByCreatedAtDesc(UUID projectId, Pageable pageable);

    long countByProjectId(UUID projectId);
}
