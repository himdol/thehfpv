package com.thehfpv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
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
    
    @PostMapping("/update-user-role")
    public ResponseEntity<?> updateUserRole(@RequestParam String email, @RequestParam String newRole) {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            // 먼저 사용자 존재 여부 확인
            String checkQuery = "SELECT user_id, email, user_role FROM users WHERE email = ?";
            try (PreparedStatement checkStmt = connection.prepareStatement(checkQuery)) {
                checkStmt.setString(1, email);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (!rs.next()) {
                        response.put("status", "error");
                        response.put("message", "User not found with email: " + email);
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    String currentRole = rs.getString("user_role");
                    int userId = rs.getInt("user_id");
                    
                    System.out.println("=== 사용자 권한 수정 ===");
                    System.out.println("Email: " + email);
                    System.out.println("Current Role: " + currentRole);
                    System.out.println("New Role: " + newRole);
                    
                    // 권한 업데이트
                    String updateQuery = "UPDATE users SET user_role = ? WHERE email = ?";
                    try (PreparedStatement updateStmt = connection.prepareStatement(updateQuery)) {
                        updateStmt.setString(1, newRole);
                        updateStmt.setString(2, email);
                        
                        int rowsAffected = updateStmt.executeUpdate();
                        
                        if (rowsAffected > 0) {
                            response.put("status", "success");
                            response.put("message", "User role updated successfully");
                            response.put("user", Map.of(
                                "userId", userId,
                                "email", email,
                                "oldRole", currentRole,
                                "newRole", newRole
                            ));
                            
                            System.out.println("사용자 권한 수정 완료: " + email + " -> " + newRole);
                            
                            return ResponseEntity.ok(response);
                        } else {
                            response.put("status", "error");
                            response.put("message", "Failed to update user role");
                            return ResponseEntity.badRequest().body(response);
                        }
                    }
                }
            }
            
        } catch (SQLException e) {
            response.put("status", "error");
            response.put("message", "Database error: " + e.getMessage());
            System.err.println("사용자 권한 수정 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
