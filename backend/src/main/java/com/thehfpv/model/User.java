package com.thehfpv.model;

import jakarta.persistence.*;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(name = "email", unique = true)
    private String email;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "password")
    private String password;
    
    @Size(max = 100)
    @Column(name = "first_name")
    private String firstName;
    
    @Size(max = 100)
    @Column(name = "last_name")
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole = UserRole.PUBLIC;
    
    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;
    
    @Column(name = "user_status")
    private Integer userStatus = 1; // 1=ACTIVE, 0=INACTIVE
    
    // 소셜 로그인 관련 필드
    @Column(name = "provider")
    private String provider; // GOOGLE, GITHUB 등
    
    @Column(name = "provider_id")
    private String providerId; // 소셜 로그인 제공자의 사용자 ID
    
    @Column(name = "profile_image_url")
    private String profileImageUrl; // 프로필 이미지 URL
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "create_date")
    private LocalDateTime createDate;
    
    @JsonFormat(pattern = "MM-dd-yyyy HH:mm:ss")
    @Column(name = "update_date")
    private LocalDateTime updateDate;
    
    
    @PrePersist
    protected void onCreate() {
        createDate = LocalDateTime.now();
        updateDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
    
    // Constructors
    public User() {}
    
    public User(String email, String password, UserRole userRole) {
        this.email = email;
        this.password = password;
        this.userRole = userRole;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public Integer getUserStatus() {
        return userStatus;
    }
    
    public void setUserStatus(Integer userStatus) {
        this.userStatus = userStatus;
    }
    
    public UserRole getUserRole() {
        return userRole;
    }
    
    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }
    
    public Boolean getEmailVerified() {
        return emailVerified;
    }
    
    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public LocalDateTime getCreateDate() {
        return createDate;
    }
    
    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
    
    public LocalDateTime getUpdateDate() {
        return updateDate;
    }
    
    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }
    
    // 소셜 로그인 관련 getter/setter
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public String getProviderId() {
        return providerId;
    }
    
    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    // UserDetails implementation
    @Override
    public String getUsername() {
        return email; // email을 username으로 사용
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userRole.getCode()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true; // 개발 단계에서는 항상 활성
    }
}