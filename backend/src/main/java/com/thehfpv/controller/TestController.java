package com.thehfpv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from TheHFPV Backend!");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "TheHFPV Backend API");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/blog")
    public ResponseEntity<Map<String, Object>> testBlog() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blog test endpoint works");
        response.put("posts", new Object[0]);
        return ResponseEntity.ok(response);
    }
}
