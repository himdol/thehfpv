package com.thehfpv.service;

import com.thehfpv.model.User;
import com.thehfpv.model.UserRole;
import com.thehfpv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User>, AuthenticationSuccessHandler, AuthenticationFailureHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.thehfpv.service.JwtService jwtService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("=== OAuth2UserService.loadUser 호출됨 ===");
        
        // 기본 OAuth2UserService를 사용하여 사용자 정보 가져오기
        org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService defaultService = 
            new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService();
        
        OAuth2User oauth2User = defaultService.loadUser(userRequest);
        
        System.out.println("기본 OAuth2User 로드 완료: " + oauth2User.getName());
        
        // 사용자 정보 처리 및 반환 (CustomOAuth2User 대신 기본 OAuth2User 반환)
        return oauth2User;
    }

    @Override
    public void onAuthenticationSuccess(jakarta.servlet.http.HttpServletRequest request, 
                                      jakarta.servlet.http.HttpServletResponse response, 
                                      org.springframework.security.core.Authentication authentication) 
                                      throws java.io.IOException, jakarta.servlet.ServletException {
        try {
            System.out.println("=== OAuth2 인증 성공 핸들러 시작 ===");
            
            // OAuth2User 타입에 관계없이 처리
            org.springframework.security.oauth2.core.user.OAuth2User oauth2User = 
                (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
            
            System.out.println("OAuth2User: " + oauth2User.getName());
            System.out.println("Attributes: " + oauth2User.getAttributes());
            
            // 사용자 정보 처리
            User user = processOAuth2User(oauth2User);
            
            // JWT 토큰 생성
            String jwtToken = jwtService.generateToken(user);
            
            System.out.println("JWT 토큰 생성 완료: " + jwtToken);
            
            // 세션에 사용자 정보 저장
            request.getSession().setAttribute("user", user);
            request.getSession().setAttribute("jwtToken", jwtToken);
            request.getSession().setAttribute("isAuthenticated", true);
            
            System.out.println("세션에 사용자 정보 저장 완료: " + user.getEmail());
            
            // 프론트엔드로 리다이렉트 (토큰은 세션에만 저장)
            String redirectUrl = "http://localhost:3000/?oauth_success=true";

            System.out.println("리다이렉트 URL: " + redirectUrl);
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            System.err.println("=== OAuth2 인증 성공 핸들러 에러 ===");
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
        }
    }

    @Override
    public void onAuthenticationFailure(jakarta.servlet.http.HttpServletRequest request, 
                                      jakarta.servlet.http.HttpServletResponse response, 
                                      org.springframework.security.core.AuthenticationException exception) 
                                      throws java.io.IOException, jakarta.servlet.ServletException {
        System.err.println("=== OAuth2 인증 실패 ===");
        System.err.println("에러: " + exception.getMessage());
        response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
    }

    private User processOAuth2User(org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
        System.out.println("=== processOAuth2User 시작 ===");
        String provider = "GOOGLE";
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        String providerId = oauth2User.getAttribute("sub");

        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        System.out.println("Picture: " + picture);
        System.out.println("ProviderId: " + providerId);

        if (email == null || email.isEmpty()) {
            System.err.println("이메일 정보가 없습니다!");
            throw new RuntimeException("이메일 정보를 가져올 수 없습니다.");
        }

        // 기존 사용자 확인 (provider + providerId로)
        Optional<User> existingUser = userRepository.findByProviderAndProviderId(provider, providerId);
        
        if (existingUser.isPresent()) {
            // 기존 소셜 로그인 사용자 - 최소한만 업데이트
            User user = existingUser.get();
            boolean needsUpdate = false;
            
            // 이메일 인증 상태 동기화 (Google에서 변경되었을 수 있음)
            Boolean emailVerified = oauth2User.getAttribute("email_verified");
            if (emailVerified != null && user.getEmailVerified() != emailVerified) {
                user.setEmailVerified(emailVerified);
                needsUpdate = true;
                System.out.println("이메일 인증 상태 업데이트: " + emailVerified);
            }
            
            // 마지막 로그인 시간 업데이트 (필수)
            user.setUpdateDate(LocalDateTime.now());
            needsUpdate = true;
            
            // 변경사항이 있을 때만 저장
            if (needsUpdate) {
                System.out.println("기존 사용자 정보 업데이트: " + user.getEmail());
                return userRepository.save(user);
            } else {
                System.out.println("기존 사용자 정보 변경사항 없음: " + user.getEmail());
                return user;
            }
        }

        // 기존 이메일로 가입된 사용자 확인
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isPresent()) {
            // 기존 사용자에 소셜 로그인 정보 추가
            User user = emailUser.get();
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setEmailVerified(true); // 소셜 로그인은 이메일 인증 완료로 간주
            user.setUpdateDate(LocalDateTime.now());
            System.out.println("기존 이메일 사용자에 소셜 로그인 정보 추가: " + user.getEmail());
            return userRepository.save(user);
        }

        // 새 사용자 생성
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setEmailVerified(true);
        newUser.setUserRole(UserRole.PUBLIC);
        newUser.setUserStatus(1);
        newUser.setCreateDate(LocalDateTime.now());
        newUser.setUpdateDate(LocalDateTime.now());
        System.out.println("새 소셜 로그인 사용자 생성: " + email);

        // 이름 분리 (Google의 경우 full name을 first/last로 분리)
        if (name != null && !name.isEmpty()) {
            String[] nameParts = name.split(" ", 2);
            newUser.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                newUser.setLastName(nameParts[1]);
            }
        }

        // 소셜 로그인 사용자는 비밀번호가 없으므로 임시 비밀번호 설정
        newUser.setPassword("SOCIAL_LOGIN_USER");

        return userRepository.save(newUser);
    }

    private String userToJson(User user) {
        // 사용자 객체를 JSON 문자열로 변환 (필요한 필드만 포함)
        return String.format("{\"userId\":%d,\"email\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"userRole\":\"%s\",\"emailVerified\":%b,\"profileImageUrl\":\"%s\"}",
                user.getUserId(), user.getEmail(), user.getFirstName(), user.getLastName(), 
                user.getUserRole().getCode(), user.getEmailVerified(), user.getProfileImageUrl());
    }

    // CustomOAuth2User 클래스 정의
    public static class CustomOAuth2User implements OAuth2User {
        private final Map<String, Object> attributes;
        private final User user;

        public CustomOAuth2User(Map<String, Object> attributes, User user) {
            this.attributes = attributes;
            this.user = user;
        }

        @Override
        public Map<String, Object> getAttributes() {
            return attributes;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().getCode()));
        }

        @Override
        public String getName() {
            return user.getEmail();
        }

        public User getUser() {
            return user;
        }
    }
}