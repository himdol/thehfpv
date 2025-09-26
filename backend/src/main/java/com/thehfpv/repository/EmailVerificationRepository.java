package com.thehfpv.repository;

import com.thehfpv.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    
    /**
     * 이메일로 인증 정보 조회
     */
    Optional<EmailVerification> findByEmail(String email);
    
    /**
     * 인증 토큰으로 인증 정보 조회
     */
    Optional<EmailVerification> findByVerificationToken(String verificationToken);
    
    /**
     * 이메일과 토큰으로 인증 정보 조회
     */
    Optional<EmailVerification> findByEmailAndVerificationToken(String email, String verificationToken);
    
    /**
     * 만료된 인증 정보 조회
     */
    @Query("SELECT ev FROM EmailVerification ev WHERE ev.expiryDate < :now AND ev.status = 0")
    List<EmailVerification> findExpiredVerifications(@Param("now") LocalDateTime now);
    
    /**
     * 만료된 인증 정보 삭제
     */
    @Modifying
    @Query("DELETE FROM EmailVerification ev WHERE ev.expiryDate < :now AND ev.status = 0")
    void deleteExpiredVerifications(@Param("now") LocalDateTime now);
    
    /**
     * 이메일로 미인증 상태의 인증 정보 조회
     */
    Optional<EmailVerification> findByEmailAndIsVerifiedFalse(String email);
}

