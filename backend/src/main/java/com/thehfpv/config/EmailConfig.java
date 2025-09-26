package com.thehfpv.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "email")
public class EmailConfig {
    
    private String provider = "smtp";
    
    private SmtpConfig smtp = new SmtpConfig();
    private SendGridConfig sendgrid = new SendGridConfig();
    private MailgunConfig mailgun = new MailgunConfig();
    private AwsSesConfig awsSes = new AwsSesConfig();
    
    // Getters and Setters
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public SmtpConfig getSmtp() {
        return smtp;
    }
    
    public void setSmtp(SmtpConfig smtp) {
        this.smtp = smtp;
    }
    
    public SendGridConfig getSendgrid() {
        return sendgrid;
    }
    
    public void setSendgrid(SendGridConfig sendgrid) {
        this.sendgrid = sendgrid;
    }
    
    public MailgunConfig getMailgun() {
        return mailgun;
    }
    
    public void setMailgun(MailgunConfig mailgun) {
        this.mailgun = mailgun;
    }
    
    public AwsSesConfig getAwsSes() {
        return awsSes;
    }
    
    public void setAwsSes(AwsSesConfig awsSes) {
        this.awsSes = awsSes;
    }
    
    // SMTP Configuration
    public static class SmtpConfig {
        private String host = "smtp.gmail.com";
        private int port = 587;
        private String username;
        private String password;
        private boolean auth = true;
        private boolean starttls = true;
        private String from;
        private String fromName = "TheHFPV";
        
        // Getters and Setters
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public boolean isAuth() { return auth; }
        public void setAuth(boolean auth) { this.auth = auth; }
        
        public boolean isStarttls() { return starttls; }
        public void setStarttls(boolean starttls) { this.starttls = starttls; }
        
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        
        public String getFromName() { return fromName; }
        public void setFromName(String fromName) { this.fromName = fromName; }
    }
    
    // SendGrid Configuration
    public static class SendGridConfig {
        private String apiKey;
        private String from;
        private String fromName = "TheHFPV";
        
        // Getters and Setters
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        
        public String getFromName() { return fromName; }
        public void setFromName(String fromName) { this.fromName = fromName; }
    }
    
    // Mailgun Configuration
    public static class MailgunConfig {
        private String apiKey;
        private String domain;
        private String from;
        private String fromName = "TheHFPV";
        
        // Getters and Setters
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        
        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }
        
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        
        public String getFromName() { return fromName; }
        public void setFromName(String fromName) { this.fromName = fromName; }
    }
    
    // AWS SES Configuration
    public static class AwsSesConfig {
        private String accessKey;
        private String secretKey;
        private String region = "us-east-1";
        private String from;
        private String fromName = "TheHFPV";
        
        // Getters and Setters
        public String getAccessKey() { return accessKey; }
        public void setAccessKey(String accessKey) { this.accessKey = accessKey; }
        
        public String getSecretKey() { return secretKey; }
        public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
        
        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
        
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        
        public String getFromName() { return fromName; }
        public void setFromName(String fromName) { this.fromName = fromName; }
    }
}
