package com.scanalytics.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Mirrors Python: lifespan() handler in main.py
 * Ensures uuid-ossp extension is created on startup.
 */
@Configuration
public class DatabaseInitConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitConfig.class);

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void initDatabase() {
        log.info("Starting Application...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");
            log.info("Database connected and uuid-ossp extension enabled!");
        } catch (Exception e) {
            log.error("Database initialization failed: {}", e.getMessage());
        }
    }
}
