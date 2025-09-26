package com.thehfpv.controller;

import com.thehfpv.model.User;
import com.thehfpv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getSessionUser(HttpServletRequest request) {
        System.out.println("=== SessionController.getSessionUser 호출됨 ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Request Method: " + request.getMethod());
        System.out.println("Request Headers: " + request.getHeaderNames());
        System.out.println("Session ID: " + (request.getSession(false) != null ? request.getSession(false).getId() : "null"));
        
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
        
        // OAuth2 인증인 경우 세션에서 사용자 정보를 직접 가져오기
        if ((isAuthenticated == null || !isAuthenticated) && user == null) {
            System.out.println("OAuth2 인증 확인 중...");
            
            // Spring Security 컨텍스트에서 OAuth2 인증 정보 확인
            org.springframework.security.core.Authentication auth = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            if (auth != null && auth.isAuthenticated() && 
                auth instanceof org.springframework.security.oauth2.core.user.OAuth2User) {
                
                org.springframework.security.oauth2.core.user.OAuth2User oauth2User = 
                    (org.springframework.security.oauth2.core.user.OAuth2User) auth;
                
                String email = oauth2User.getAttribute("email");
                System.out.println("OAuth2 인증된 사용자: " + email);
                
                if (email != null) {
                    // DB에서 사용자 정보 조회
                    try {
                        user = userRepository.findByEmail(email).orElse(null);
                        if (user != null) {
                            // 세션에 사용자 정보 저장
                            session.setAttribute("user", user);
                            session.setAttribute("isAuthenticated", true);
                            isAuthenticated = true;
                            System.out.println("OAuth2 사용자 정보를 세션에 저장: " + user.getEmail());
                        }
                    } catch (Exception e) {
                        System.out.println("OAuth2 사용자 정보 조회 실패: " + e.getMessage());
                    }
                }
            }
        }
        
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
