package com.thehfpv.service.impl;

import com.thehfpv.config.EmailConfig;
import com.thehfpv.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailServiceImpl implements EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    
    @Autowired
    private EmailConfig emailConfig;
    
    private JavaMailSender mailSender;
    
    @Override
    public boolean sendEmail(String to, String subject, String content) {
        try {
            JavaMailSender sender = getMailSender();
            if (sender == null) {
                logger.error("Mail sender is not configured properly");
                return false;
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            message.setFrom(getFromAddress());
            
            sender.send(message);
            logger.info("Email sent successfully to: {}", to);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send email to: {}, error: {}", to, e.getMessage());
            return false;
        }
    }
    
    @Override
    public boolean sendHtmlEmail(String to, String subject, String htmlContent) {
        // HTML 이메일은 추후 구현
        logger.warn("HTML email sending not implemented yet, falling back to plain text");
        return sendEmail(to, subject, htmlContent.replaceAll("<[^>]*>", ""));
    }
    
    @Override
    public boolean sendVerificationEmail(String to, String token) {
        String subject = "이메일 인증을 완료해주세요";
        String content = String.format(
            "안녕하세요!\n\n" +
            "이메일 인증을 완료하기 위해 아래 링크를 클릭해주세요:\n\n" +
            "http://localhost:3000/verify-email?token=%s\n\n" +
            "이 링크는 24시간 후에 만료됩니다.\n\n" +
            "감사합니다.\n" +
            "TheHFPV 팀",
            token
        );
        
        return sendEmail(to, subject, content);
    }
    
    @Override
    public boolean sendPasswordResetEmail(String to, String token) {
        String subject = "비밀번호 재설정 요청";
        String content = String.format(
            "안녕하세요!\n\n" +
            "비밀번호 재설정을 위해 아래 링크를 클릭해주세요:\n\n" +
            "http://localhost:3000/reset-password?token=%s\n\n" +
            "이 링크는 1시간 후에 만료됩니다.\n\n" +
            "만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시해주세요.\n\n" +
            "감사합니다.\n" +
            "TheHFPV 팀",
            token
        );
        
        return sendEmail(to, subject, content);
    }
    
    @Override
    public boolean sendWelcomeEmail(String to, String firstName) {
        String subject = "TheHFPV에 오신 것을 환영합니다!";
        String content = String.format(
            "안녕하세요 %s님!\n\n" +
            "TheHFPV에 가입해주셔서 감사합니다.\n\n" +
            "이제 모든 기능을 사용하실 수 있습니다.\n\n" +
            "궁금한 점이 있으시면 언제든지 문의해주세요.\n\n" +
            "감사합니다.\n" +
            "TheHFPV 팀",
            firstName
        );
        
        return sendEmail(to, subject, content);
    }
    
    private JavaMailSender getMailSender() {
        if (mailSender == null) {
            mailSender = createMailSender();
        }
        return mailSender;
    }
    
    private JavaMailSender createMailSender() {
        if (!"smtp".equals(emailConfig.getProvider())) {
            logger.warn("Only SMTP provider is currently implemented. Provider: {}", emailConfig.getProvider());
            return null;
        }
        
        EmailConfig.SmtpConfig smtpConfig = emailConfig.getSmtp();
        
        if (smtpConfig.getUsername() == null || smtpConfig.getPassword() == null) {
            logger.error("SMTP username or password is not configured");
            return null;
        }
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(smtpConfig.getHost());
        mailSender.setPort(smtpConfig.getPort());
        mailSender.setUsername(smtpConfig.getUsername());
        mailSender.setPassword(smtpConfig.getPassword());
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", smtpConfig.isAuth());
        props.put("mail.smtp.starttls.enable", smtpConfig.isStarttls());
        props.put("mail.debug", "false");
        
        return mailSender;
    }
    
    private String getFromAddress() {
        switch (emailConfig.getProvider()) {
            case "smtp":
                return emailConfig.getSmtp().getFrom();
            case "sendgrid":
                return emailConfig.getSendgrid().getFrom();
            case "mailgun":
                return emailConfig.getMailgun().getFrom();
            case "aws-ses":
                return emailConfig.getAwsSes().getFrom();
            default:
                return "noreply@thehfpv.com";
        }
    }
}
