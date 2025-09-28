package com.thehfpv.service;

import com.thehfpv.model.VisitorStats;
import com.thehfpv.model.DailyStats;
import com.thehfpv.repository.VisitorStatsRepository;
import com.thehfpv.repository.DailyStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class VisitorService {
    
    @Autowired
    private VisitorStatsRepository visitorStatsRepository;
    
    @Autowired
    private DailyStatsRepository dailyStatsRepository;
    
    /**
     * 방문자 추적 및 기록
     */
    @Transactional(noRollbackFor = Exception.class)
    public void trackVisitor(HttpServletRequest request) {
        try {
            String visitorIp = getClientIpAddress(request);
            LocalDate today = LocalDate.now();
            String userAgent = request.getHeader("User-Agent");
            String referer = request.getHeader("Referer");
            
            System.out.println("=== 방문자 추적 시작 ===");
            System.out.println("Visitor IP: " + visitorIp);
            System.out.println("Date: " + today);
            System.out.println("User-Agent: " + userAgent);
            System.out.println("Referer: " + referer);
            
            // 중복 방문 체크 - 같은 IP가 오늘 이미 방문했는지 확인
            Optional<VisitorStats> existingVisitor = visitorStatsRepository.findByVisitorIpAndVisitorDate(visitorIp, today);
            
            if (existingVisitor.isPresent()) {
                System.out.println("중복 방문자 감지: " + visitorIp + " (오늘 이미 방문함 - 카운트하지 않음)");
                return; // 중복 방문자는 카운트하지 않음
            }
            
            // 새로운 방문자만 기록
            VisitorStats visitorStats = new VisitorStats(visitorIp, today, userAgent, referer);
            visitorStatsRepository.save(visitorStats);
            
            System.out.println("새로운 방문자 기록 저장: " + visitorIp + " (고유 방문자)");
            
        } catch (Exception e) {
            // 에러 로그를 간단하게만 출력
            System.out.println("방문자 추적 중 경미한 오류 발생 (정상 작동): " + e.getClass().getSimpleName());
            // 예외를 다시 던지지 않아서 트랜잭션이 롤백되지 않음
        }
    }
    
    /**
     * 일일 통계 업데이트 (비동기)
     */
    private void updateDailyStatsAsync(LocalDate date) {
        try {
            updateDailyStats(date);
        } catch (Exception e) {
            System.out.println("일일 통계 업데이트 중 오류 (무시): " + e.getClass().getSimpleName());
        }
    }
    
    /**
     * 일일 통계 업데이트
     */
    private void updateDailyStats(LocalDate date) {
        try {
            // 오늘의 통계 조회 또는 생성
            DailyStats dailyStats = dailyStatsRepository.findByStatDate(date)
                .orElse(new DailyStats(date, 0, 0L));
            
            // 오늘의 고유 방문자 수 계산
            Long todayVisitors = visitorStatsRepository.countDistinctVisitorsByDate(date);
            dailyStats.setVisitorCount(todayVisitors.intValue());
            
            // 전체 누적 방문자 수 계산
            Long totalVisitors = visitorStatsRepository.countDistinctTotalVisitors();
            dailyStats.setTotalVisitors(totalVisitors);
            
            dailyStatsRepository.save(dailyStats);
            
            System.out.println("일일 통계 업데이트 완료:");
            System.out.println("- 날짜: " + date);
            System.out.println("- 오늘 방문자: " + todayVisitors);
            System.out.println("- 총 방문자: " + totalVisitors);
            
        } catch (Exception e) {
            // 개발 중에는 에러 로그를 간단하게만 출력
            System.out.println("일일 통계 업데이트 중 경미한 오류 발생 (정상 작동): " + e.getClass().getSimpleName());
        }
    }
    
    /**
     * 방문자 통계 조회
     */
    public Map<String, Object> getVisitorStats() {
        try {
            LocalDate today = LocalDate.now();
            
            // 오늘의 방문자 수
            Long todayVisitors = visitorStatsRepository.countDistinctVisitorsByDate(today);
            
            // 전체 누적 방문자 수
            Long totalVisitors = visitorStatsRepository.countDistinctTotalVisitors();
            
            // 일일 통계에서 최신 정보 조회 (캐시된 값)
            Optional<DailyStats> latestStats = dailyStatsRepository.findLatestStats();
            if (latestStats.isPresent()) {
                DailyStats stats = latestStats.get();
                // 오늘 날짜와 일치하는 경우 캐시된 값 사용
                if (stats.getStatDate().equals(today)) {
                    todayVisitors = stats.getVisitorCount().longValue();
                }
                totalVisitors = stats.getTotalVisitors();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("todayVisitors", todayVisitors);
            response.put("totalVisitors", totalVisitors);
            response.put("lastUpdated", LocalDateTime.now());
            response.put("status", "success");
            
            System.out.println("=== 방문자 통계 조회 ===");
            System.out.println("Today Visitors: " + todayVisitors);
            System.out.println("Total Visitors: " + totalVisitors);
            
            return response;
            
        } catch (Exception e) {
            System.err.println("방문자 통계 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("todayVisitors", 0);
            errorResponse.put("totalVisitors", 0);
            errorResponse.put("lastUpdated", LocalDateTime.now());
            errorResponse.put("status", "error");
            errorResponse.put("message", "통계 조회 중 오류가 발생했습니다.");
            
            return errorResponse;
        }
    }
    
    /**
     * 클라이언트 IP 주소 추출
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr != null && !remoteAddr.isEmpty()) {
            return remoteAddr;
        }
        
        return "unknown";
    }
    
    /**
     * 통계 초기화 (개발/테스트용)
     */
    public void resetStats() {
        try {
            visitorStatsRepository.deleteAll();
            dailyStatsRepository.deleteAll();
            System.out.println("모든 방문자 통계가 초기화되었습니다.");
        } catch (Exception e) {
            System.err.println("통계 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * 개발용 방문자 수 증가 (테스트용)
     */
    @Transactional
    public void increaseVisitorCount() {
        try {
            LocalDate today = LocalDate.now();
            
            // 고유한 IP 주소 생성 (타임스탬프 사용)
            String testIp = "127.0.0." + (System.currentTimeMillis() % 255);
            String testUserAgent = "Test-Browser/Dev-" + System.currentTimeMillis();
            String testReferer = "http://localhost:3000";
            
            // 새로운 방문자 기록 생성
            VisitorStats visitorStats = new VisitorStats(testIp, today, testUserAgent, testReferer);
            visitorStatsRepository.save(visitorStats);
            
            System.out.println("개발용 방문자 수 증가: " + testIp);
            
            // 일일 통계 업데이트
            updateDailyStats(today);
            
        } catch (Exception e) {
            System.err.println("방문자 수 증가 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
