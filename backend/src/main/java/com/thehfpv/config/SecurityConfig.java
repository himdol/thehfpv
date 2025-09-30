package com.thehfpv.config;

import com.thehfpv.security.JwtAuthenticationFilter;
import com.thehfpv.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService, 
                         CustomOAuth2UserService customOAuth2UserService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.customOAuth2UserService = customOAuth2UserService;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public org.springframework.security.web.firewall.HttpFirewall httpFirewall() {
        return new org.springframework.security.web.firewall.DefaultHttpFirewall();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/visitor/**").permitAll() // 방문자 통계 API 허용
                .requestMatchers("/api/visitor/**").permitAll() // 방문자 통계 API 허용
                .requestMatchers("/session/**").permitAll() // 세션 관련 경로 허용
                .requestMatchers("/auth/register", "/auth/login").permitAll()
                .requestMatchers("/auth/profile").authenticated() // 프로필 수정은 인증 필요
                .requestMatchers("/upload/**").authenticated() // 이미지 업로드는 인증 필요
                .requestMatchers("/uploads/**").permitAll() // 업로드된 이미지 파일 접근 허용
                .requestMatchers("/blog/posts").permitAll() // 블로그 포스트 조회 허용
                .requestMatchers("/blog/posts/*/like").authenticated() // 좋아요 토글은 인증 필요
                .requestMatchers("/blog/posts/*/like-status").authenticated() // 좋아요 상태 조회는 인증 필요
                .requestMatchers("/blog/posts/**").permitAll() // 블로그 포스트 관련 다른 API 허용
                .requestMatchers("/blog/**").permitAll() // 블로그 관련 다른 API 허용
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll() // OAuth2 경로 허용
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/database/**").permitAll()
                .requestMatchers("/test/**").permitAll()
                .requestMatchers("/test/email/**").permitAll()
                .requestMatchers("/admin/clear-data").permitAll()
                .requestMatchers("/admin/**").hasAnyRole("ADMIN", "ROOT") // 관리자만 접근
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .successHandler(customOAuth2UserService)
                .failureHandler(customOAuth2UserService)
            )
            .formLogin(form -> form
                .disable() // 기본 폼 로그인 비활성화 (우리는 API 기반 로그인 사용)
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    System.out.println("=== AuthenticationEntryPoint 호출됨 ===");
                    System.out.println("Request URI: " + request.getRequestURI());
                    System.out.println("Content-Type: " + request.getHeader("Content-Type"));
                    System.out.println("X-Requested-With: " + request.getHeader("X-Requested-With"));
                    
                    // API 요청인 경우 JSON 응답 반환
                    if ("application/json".equals(request.getHeader("Content-Type")) ||
                        "XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
                        response.setStatus(401);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                    } else {
                        // 웹 요청인 경우 OAuth2로 리다이렉트
                        response.sendRedirect("/oauth2/authorization/google");
                    }
                })
            );
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false); // 사용자 찾기 실패 시 예외 표시
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
