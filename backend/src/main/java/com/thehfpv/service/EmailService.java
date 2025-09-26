package com.thehfpv.service;

public interface EmailService {
    
    /**
     * 이메일 전송
     * @param to 수신자 이메일
     * @param subject 제목
     * @param content 내용
     * @return 전송 성공 여부
     */
    boolean sendEmail(String to, String subject, String content);
    
    /**
     * HTML 이메일 전송
     * @param to 수신자 이메일
     * @param subject 제목
     * @param htmlContent HTML 내용
     * @return 전송 성공 여부
     */
    boolean sendHtmlEmail(String to, String subject, String htmlContent);
    
    /**
     * 이메일 인증 토큰 전송
     * @param to 수신자 이메일
     * @param token 인증 토큰
     * @return 전송 성공 여부
     */
    boolean sendVerificationEmail(String to, String token);
    
    /**
     * 비밀번호 재설정 이메일 전송
     * @param to 수신자 이메일
     * @param token 재설정 토큰
     * @return 전송 성공 여부
     */
    boolean sendPasswordResetEmail(String to, String token);
    
    /**
     * 환영 이메일 전송
     * @param to 수신자 이메일
     * @param firstName 사용자 이름
     * @return 전송 성공 여부
     */
    boolean sendWelcomeEmail(String to, String firstName);
}
