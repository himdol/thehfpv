package com.thehfpv.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_stats", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"visitor_ip", "visitor_date"}))
public class VisitorStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @NotBlank
    @Column(name = "visitor_ip", nullable = false, length = 45)
    private String visitorIp;
    
    @Column(name = "visitor_date", nullable = false)
    private LocalDate visitorDate;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "referer", length = 500)
    private String referer;
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public VisitorStats() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // 생성자
    public VisitorStats(String visitorIp, LocalDate visitorDate, String userAgent, String referer) {
        this();
        this.visitorIp = visitorIp;
        this.visitorDate = visitorDate;
        this.userAgent = userAgent;
        this.referer = referer;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getVisitorIp() {
        return visitorIp;
    }
    
    public void setVisitorIp(String visitorIp) {
        this.visitorIp = visitorIp;
    }
    
    public LocalDate getVisitorDate() {
        return visitorDate;
    }
    
    public void setVisitorDate(LocalDate visitorDate) {
        this.visitorDate = visitorDate;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public String getReferer() {
        return referer;
    }
    
    public void setReferer(String referer) {
        this.referer = referer;
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
        return "VisitorStats{" +
                "id=" + id +
                ", visitorIp='" + visitorIp + '\'' +
                ", visitorDate=" + visitorDate +
                ", userAgent='" + userAgent + '\'' +
                ", referer='" + referer + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
