package com.thehfpv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/database")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            // Test basic connection
            boolean isValid = connection.isValid(5);
            
            // Get connection info
            String url = connection.getMetaData().getURL();
            String username = connection.getMetaData().getUserName();
            String driverName = connection.getMetaData().getDriverName();
            String driverVersion = connection.getMetaData().getDriverVersion();
            String databaseProduct = connection.getMetaData().getDatabaseProductName();
            String databaseVersion = connection.getMetaData().getDatabaseProductVersion();
            
            response.put("status", "success");
            response.put("message", "Database connection successful");
            response.put("connection", Map.of(
                "valid", isValid,
                "url", url,
                "username", username,
                "driverName", driverName,
                "driverVersion", driverVersion,
                "databaseProduct", databaseProduct,
                "databaseVersion", databaseVersion
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (SQLException e) {
            response.put("status", "error");
            response.put("message", "Database connection failed");
            response.put("error", Map.of(
                "code", e.getErrorCode(),
                "sqlState", e.getSQLState(),
                "message", e.getMessage()
            ));
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<?> getDatabaseInfo() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            String url = connection.getMetaData().getURL();
            String username = connection.getMetaData().getUserName();
            String databaseProduct = connection.getMetaData().getDatabaseProductName();
            String databaseVersion = connection.getMetaData().getDatabaseProductVersion();
            
            response.put("database", Map.of(
                "url", url,
                "username", username,
                "product", databaseProduct,
                "version", databaseVersion
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (SQLException e) {
            response.put("error", "Failed to get database info: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
