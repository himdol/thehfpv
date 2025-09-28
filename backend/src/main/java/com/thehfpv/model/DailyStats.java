package com.thehfpv.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_stats", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"stat_date"}))
public class DailyStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;
    
    @Column(name = "visitor_count", nullable = false)
    private Integer visitorCount = 0;
    
    @Column(name = "total_visitors", nullable = false)
    private Long totalVisitors = 0L;
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public DailyStats() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // 생성자
    public DailyStats(LocalDate statDate, Integer visitorCount, Long totalVisitors) {
        this();
        this.statDate = statDate;
        this.visitorCount = visitorCount;
        this.totalVisitors = totalVisitors;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDate getStatDate() {
        return statDate;
    }
    
    public void setStatDate(LocalDate statDate) {
        this.statDate = statDate;
    }
    
    public Integer getVisitorCount() {
        return visitorCount;
    }
    
    public void setVisitorCount(Integer visitorCount) {
        this.visitorCount = visitorCount;
    }
    
    public Long getTotalVisitors() {
        return totalVisitors;
    }
    
    public void setTotalVisitors(Long totalVisitors) {
        this.totalVisitors = totalVisitors;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "DailyStats{" +
                "id=" + id +
                ", statDate=" + statDate +
                ", visitorCount=" + visitorCount +
                ", totalVisitors=" + totalVisitors +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
