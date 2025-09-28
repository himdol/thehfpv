package com.thehfpv.controller;

import com.thehfpv.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/visitor")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class VisitorController {
    
    @Autowired
    private VisitorService visitorService;
    
    /**
     * 방문자 통계 조회
     * GET /api/visitor/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getVisitorStats() {
        try {
            System.out.println("=== VisitorController.getVisitorStats 호출됨 ===");
            
            Map<String, Object> stats = visitorService.getVisitorStats();
            
            if ("error".equals(stats.get("status"))) {
                return ResponseEntity.badRequest().body(stats);
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("방문자 통계 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = Map.of(
                "status", "error",
                "message", "방문자 통계 조회 중 오류가 발생했습니다.",
                "todayVisitors", 0,
                "totalVisitors", 0
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * 방문자 추적
     * POST /api/visitor/track
     */
    @PostMapping("/track")
    public ResponseEntity<Map<String, Object>> trackVisitor(HttpServletRequest request) {
        try {
            System.out.println("=== VisitorController.trackVisitor 호출됨 ===");
            System.out.println("Request URI: " + request.getRequestURI());
            System.out.println("Remote Address: " + request.getRemoteAddr());
            System.out.println("User-Agent: " + request.getHeader("User-Agent"));
            
            visitorService.trackVisitor(request);
            
            Map<String, Object> response = Map.of(
                "status", "success",
                "message", "방문자 추적이 완료되었습니다."
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("방문자 추적 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = Map.of(
                "status", "error",
                "message", "방문자 추적 중 오류가 발생했습니다."
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * 통계 초기화 (개발/테스트용)
     * DELETE /api/visitor/reset
     */
    @DeleteMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetStats() {
        try {
            System.out.println("=== VisitorController.resetStats 호출됨 ===");
            
            visitorService.resetStats();
            
            Map<String, Object> response = Map.of(
                "status", "success",
                "message", "모든 방문자 통계가 초기화되었습니다."
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("통계 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = Map.of(
                "status", "error",
                "message", "통계 초기화 중 오류가 발생했습니다."
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * 개발용 방문자 수 증가 (테스트용)
     * POST /api/visitor/increase
     */
    @PostMapping("/increase")
    public ResponseEntity<Map<String, Object>> increaseVisitorCount() {
        try {
            System.out.println("=== VisitorController.increaseVisitorCount 호출됨 ===");
            
            visitorService.increaseVisitorCount();
            
            Map<String, Object> response = Map.of(
                "status", "success",
                "message", "방문자 수가 1 증가했습니다."
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("방문자 수 증가 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = Map.of(
                "status", "error",
                "message", "방문자 수 증가 중 오류가 발생했습니다."
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
