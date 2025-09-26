package com.thehfpv.controller;

import com.thehfpv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @DeleteMapping("/clear-data")
    public ResponseEntity<?> clearAllData() {
        try {
            // Delete all users
            userRepository.deleteAll();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "All data cleared successfully");
            response.put("usersDeleted", "All users deleted");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to clear data: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

