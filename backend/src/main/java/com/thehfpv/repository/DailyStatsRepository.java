package com.thehfpv.repository;

import com.thehfpv.model.DailyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyStatsRepository extends JpaRepository<DailyStats, Long> {
    
    /**
     * 특정 날짜의 통계 조회
     */
    Optional<DailyStats> findByStatDate(LocalDate statDate);
    
    /**
     * 가장 최근의 통계 조회
     */
    @Query("SELECT ds FROM DailyStats ds ORDER BY ds.statDate DESC LIMIT 1")
    Optional<DailyStats> findLatestStats();
    
    /**
     * 특정 날짜의 통계 존재 여부 확인
     */
    boolean existsByStatDate(LocalDate statDate);
    
    /**
     * 전체 기간의 총 방문자 수 조회 (가장 최근 기록)
     */
    @Query("SELECT ds.totalVisitors FROM DailyStats ds ORDER BY ds.statDate DESC LIMIT 1")
    Optional<Long> findLatestTotalVisitors();
    
    /**
     * 특정 날짜 범위의 통계 조회
     */
    @Query("SELECT ds FROM DailyStats ds WHERE ds.statDate BETWEEN :startDate AND :endDate ORDER BY ds.statDate ASC")
    java.util.List<DailyStats> findByStatDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
