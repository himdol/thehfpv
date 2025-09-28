package com.thehfpv.repository;

import com.thehfpv.model.VisitorStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface VisitorStatsRepository extends JpaRepository<VisitorStats, Long> {
    
    /**
     * 특정 IP와 날짜로 방문 기록 조회
     */
    Optional<VisitorStats> findByVisitorIpAndVisitorDate(String visitorIp, LocalDate visitorDate);
    
    /**
     * 특정 날짜의 총 방문자 수 조회
     */
    @Query("SELECT COUNT(DISTINCT vs.visitorIp) FROM VisitorStats vs WHERE vs.visitorDate = :date")
    Long countDistinctVisitorsByDate(@Param("date") LocalDate date);
    
    /**
     * 전체 기간의 총 방문자 수 조회 (중복 제거)
     */
    @Query("SELECT COUNT(DISTINCT vs.visitorIp) FROM VisitorStats vs")
    Long countDistinctTotalVisitors();
    
    /**
     * 특정 날짜의 방문 기록 존재 여부 확인
     */
    boolean existsByVisitorIpAndVisitorDate(String visitorIp, LocalDate visitorDate);
    
    /**
     * 특정 날짜 범위의 방문자 수 조회
     */
    @Query("SELECT COUNT(DISTINCT vs.visitorIp) FROM VisitorStats vs WHERE vs.visitorDate BETWEEN :startDate AND :endDate")
    Long countDistinctVisitorsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
