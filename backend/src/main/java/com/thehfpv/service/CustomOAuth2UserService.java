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

import jakarta.servlet.http.HttpSession;
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
        System.out.println("=== OAuth2UserService.loadUser called ===");
        
        // 기본 OAuth2UserService를 사용하여 사용자 정보 가져오기
        org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService defaultService = 
            new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService();
        
        OAuth2User oauth2User = defaultService.loadUser(userRequest);
        
        System.out.println("Default OAuth2User loaded successfully: " + oauth2User.getName());
        
        // 사용자 정보 처리 및 반환 (CustomOAuth2User 대신 기본 OAuth2User 반환)
        return oauth2User;
    }

    @Override
    public void onAuthenticationSuccess(jakarta.servlet.http.HttpServletRequest request, 
                                      jakarta.servlet.http.HttpServletResponse response, 
                                      org.springframework.security.core.Authentication authentication) 
                                      throws java.io.IOException, jakarta.servlet.ServletException {
        try {
            System.out.println("=== OAuth2 authentication success handler started ===");
            
            // OAuth2User 타입에 관계없이 처리
            org.springframework.security.oauth2.core.user.OAuth2User oauth2User = 
                (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
            
            System.out.println("OAuth2User: " + oauth2User.getName());
            System.out.println("Attributes: " + oauth2User.getAttributes());
            
            // 사용자 정보 처리
            User user = processOAuth2User(oauth2User);
            
            // JWT 토큰 생성
            String jwtToken = jwtService.generateToken(user);
            
            System.out.println("JWT token generated successfully: " + jwtToken);
            
            // 세션에 사용자 정보 저장
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            session.setAttribute("jwtToken", jwtToken);
            session.setAttribute("isAuthenticated", true);
            
            System.out.println("User information saved to session: " + user.getEmail());
            System.out.println("Session ID: " + session.getId());
            
            // 세션 저장 확인
            User savedUser = (User) session.getAttribute("user");
            String savedToken = (String) session.getAttribute("jwtToken");
            Boolean savedAuth = (Boolean) session.getAttribute("isAuthenticated");
            
            System.out.println("Session save confirmation:");
            System.out.println("- user: " + (savedUser != null ? savedUser.getEmail() : "null"));
            System.out.println("- jwtToken: " + (savedToken != null ? "exists" : "none"));
            System.out.println("- isAuthenticated: " + savedAuth);
            
            // Spring Security 컨텍스트에 JWT 인증 정보 설정
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password("") // OAuth2에서는 패스워드가 없음
                    .authorities("ROLE_USER")
                    .build();
            
            org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            // SecurityContext 생성 및 설정
            org.springframework.security.core.context.SecurityContext securityContext = 
                org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authToken);
            
            // 세션에 SecurityContext 저장 (OAuth2 인증을 완전히 대체)
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
            
            // 현재 스레드의 SecurityContext도 설정
            org.springframework.security.core.context.SecurityContextHolder.setContext(securityContext);
            
            System.out.println("JWT authentication information set in Spring Security context");
            System.out.println("New authentication info: " + authToken.getPrincipal());
            
            // 프론트엔드로 리다이렉트 (JWT 토큰을 URL 파라미터로 전달)
            String redirectUrl = "http://localhost:3000/?oauth_success=true&token=" + jwtToken;

            System.out.println("Redirect URL: " + redirectUrl);
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            System.err.println("=== OAuth2 authentication success handler error ===");
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
        }
    }

    @Override
    public void onAuthenticationFailure(jakarta.servlet.http.HttpServletRequest request, 
                                      jakarta.servlet.http.HttpServletResponse response, 
                                      org.springframework.security.core.AuthenticationException exception) 
                                      throws java.io.IOException, jakarta.servlet.ServletException {
        System.err.println("=== OAuth2 authentication failed ===");
        System.err.println("Error: " + exception.getMessage());
        System.err.println("Error type: " + exception.getClass().getSimpleName());
        
        // OAuth 취소 상황 감지
        String errorMessage = exception.getMessage();
        if (errorMessage != null && (errorMessage.contains("access_denied") || 
                                   errorMessage.contains("user_cancelled") ||
                                   errorMessage.contains("cancelled"))) {
            System.err.println("User cancelled OAuth authentication.");
            response.sendRedirect("http://localhost:3000/login?error=oauth_cancelled");
        } else {
            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
        }
    }

    private User processOAuth2User(org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
        System.out.println("=== processOAuth2User started ===");
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
            System.err.println("Email information is missing!");
            throw new RuntimeException("Unable to retrieve email information.");
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
                System.out.println("Email verification status updated: " + emailVerified);
            }
            
            // 마지막 로그인 시간 업데이트 (필수)
            user.setUpdateDate(LocalDateTime.now());
            needsUpdate = true;
            
            // 변경사항이 있을 때만 저장
            if (needsUpdate) {
                System.out.println("Existing user information updated: " + user.getEmail());
                return userRepository.save(user);
            } else {
                System.out.println("No changes to existing user information: " + user.getEmail());
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
            System.out.println("Social login info added to existing email user: " + user.getEmail());
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
        System.out.println("New social login user created: " + email);

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