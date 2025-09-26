package com.thehfpv.controller;

import com.thehfpv.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test/email")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailTestController {
    
    @Autowired
    private EmailService emailService;
    
    /**
     * 이메일 서비스 테스트
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String subject = request.get("subject");
            String content = request.get("content");
            
            if (to == null || to.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("수신자 이메일이 필요합니다."));
            }
            
            if (subject == null || subject.isEmpty()) {
                subject = "테스트 이메일";
            }
            
            if (content == null || content.isEmpty()) {
                content = "이것은 테스트 이메일입니다.";
            }
            
            boolean success = emailService.sendEmail(to, subject, content);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "이메일이 성공적으로 전송되었습니다.");
                response.put("to", to);
                response.put("subject", subject);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("이메일 전송에 실패했습니다."));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("이메일 전송 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 이메일 인증 테스트
     */
    @PostMapping("/verification")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String token = request.getOrDefault("token", "test-token-12345");
            
            if (to == null || to.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("수신자 이메일이 필요합니다."));
            }
            
            boolean success = emailService.sendVerificationEmail(to, token);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "인증 이메일이 성공적으로 전송되었습니다.");
                response.put("to", to);
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("인증 이메일 전송에 실패했습니다."));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("인증 이메일 전송 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 비밀번호 재설정 이메일 테스트
     */
    @PostMapping("/password-reset")
    public ResponseEntity<?> sendPasswordResetEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String token = request.getOrDefault("token", "reset-token-12345");
            
            if (to == null || to.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("수신자 이메일이 필요합니다."));
            }
            
            boolean success = emailService.sendPasswordResetEmail(to, token);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "비밀번호 재설정 이메일이 성공적으로 전송되었습니다.");
                response.put("to", to);
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("비밀번호 재설정 이메일 전송에 실패했습니다."));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("비밀번호 재설정 이메일 전송 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 환영 이메일 테스트
     */
    @PostMapping("/welcome")
    public ResponseEntity<?> sendWelcomeEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String firstName = request.getOrDefault("firstName", "사용자");
            
            if (to == null || to.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("수신자 이메일이 필요합니다."));
            }
            
            boolean success = emailService.sendWelcomeEmail(to, firstName);
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "환영 이메일이 성공적으로 전송되었습니다.");
                response.put("to", to);
                response.put("firstName", firstName);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("환영 이메일 전송에 실패했습니다."));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("환영 이메일 전송 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return errorResponse;
    }
}
