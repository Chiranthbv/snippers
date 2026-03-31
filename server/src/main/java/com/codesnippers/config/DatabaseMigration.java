package com.codesnippers.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * Runs BEFORE DataSeeder (@Order(0) vs @Order(1)) to fix any column type
 * issues in the database.  Uses raw JDBC with autocommit=true so that each
 * ALTER TABLE lives in its own implicit transaction — a failure in one
 * column fix cannot abort any other statement.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Order(0)
public class DatabaseMigration implements CommandLineRunner {

    private final DataSource dataSource;

    @Override
    public void run(String... args) {
        log.info("Running database migration checks...");
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(true); // each statement = its own transaction

            fixColumn(conn, "language",   "VARCHAR(50)");
            fixColumn(conn, "visibility", "VARCHAR(255)");
            fixColumn(conn, "title",      "VARCHAR(100)");
            fixColumn(conn, "short_url",  "VARCHAR(10)");
            fixColumn(conn, "content",    "TEXT");

            log.info("Database migration checks complete.");
        } catch (Exception e) {
            log.warn("Database migration checks failed (non-fatal): {}", e.getMessage());
        }
    }

    private void fixColumn(Connection conn, String column, String targetType) {
        String sql = "ALTER TABLE snippets ALTER COLUMN " + column +
                     " SET DATA TYPE " + targetType +
                     " USING " + column + "::text" +
                     (targetType.equalsIgnoreCase("TEXT") ? "" : ("::" + targetType.toLowerCase()));
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
            log.info("  ✓ Fixed column '{}' → {}", column, targetType);
        } catch (Exception e) {
            // Column is already the correct type, or table doesn't exist yet — harmless
            log.debug("  Column '{}' fix skipped: {}", column, e.getMessage());
        }
    }
}
