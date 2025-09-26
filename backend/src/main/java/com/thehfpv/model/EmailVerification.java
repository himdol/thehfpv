package com.thehfpv.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

/**
 * 이메일 인증 엔티티
 * 회원가입 시 이메일 인증을 위한 토큰 관리
 */
@Entity
@Table(name = "email_verifications")
public class EmailVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "verification_id")
    private Long verificationId;
    
    @NotBlank
    @Email
    @Column(name = "email", nullable = false)
    private String email;
    
    @NotBlank
    @Column(name = "verification_token", nullable = false, unique = true)
    private String verificationToken;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    
    @Column(name = "create_date", nullable = false, updatable = false)
    private LocalDateTime createDate;
    
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(name = "verify_date")
    private LocalDateTime verifyDate;
    
    @Comment("$$code.인증상태.0=PENDING=대기중,1=VERIFIED=인증완료,2=EXPIRED=만료")
    @Column(name = "status")
    private Integer status = 0; // 0=PENDING, 1=VERIFIED, 2=EXPIRED
    
    @PrePersist
    protected void onCreate() {
        createDate = LocalDateTime.now();
        // 10분 후 만료
        expiryDate = createDate.plusMinutes(10);
    }
    
    // Constructors
    public EmailVerification() {}
    
    public EmailVerification(String email, String verificationToken) {
        this.email = email;
        this.verificationToken = verificationToken;
    }
    
    // Getters and Setters
    public Long getVerificationId() {
        return verificationId;
    }
    
    public void setVerificationId(Long verificationId) {
        this.verificationId = verificationId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getVerificationToken() {
        return verificationToken;
    }
    
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public LocalDateTime getCreateDate() {
        return createDate;
    }
    
    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
    
    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public LocalDateTime getVerifyDate() {
        return verifyDate;
    }
    
    public void setVerifyDate(LocalDateTime verifyDate) {
        this.verifyDate = verifyDate;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    /**
     * 인증 토큰이 만료되었는지 확인
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
    
    /**
     * 인증 완료 처리
     */
    public void markAsVerified() {
        this.isVerified = true;
        this.status = 1; // VERIFIED
        this.verifyDate = LocalDateTime.now();
    }
    
    /**
     * 만료 처리
     */
    public void markAsExpired() {
        this.status = 2; // EXPIRED
    }
}

