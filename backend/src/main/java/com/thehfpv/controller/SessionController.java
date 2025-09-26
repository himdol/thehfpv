package com.thehfpv.controller;

import com.thehfpv.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getSessionUser(HttpServletRequest request) {
        System.out.println("=== SessionController.getSessionUser 호출됨 ===");
        
        HttpSession session = request.getSession(false);
        
        if (session == null) {
            System.out.println("세션이 없습니다.");
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        
        Boolean isAuthenticated = (Boolean) session.getAttribute("isAuthenticated");
        User user = (User) session.getAttribute("user");
        String jwtToken = (String) session.getAttribute("jwtToken");
        
        System.out.println("세션 정보:");
        System.out.println("- isAuthenticated: " + isAuthenticated);
        System.out.println("- user: " + (user != null ? user.getEmail() : "null"));
        System.out.println("- jwtToken: " + (jwtToken != null ? "있음" : "없음"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", isAuthenticated != null && isAuthenticated);
        
        if (user != null) {
            response.put("user", user);
        }
        
        if (jwtToken != null) {
            response.put("jwtToken", jwtToken);
        }
        
        System.out.println("응답 데이터: " + response);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            session.invalidate();
        }
        
        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));
    }
}
