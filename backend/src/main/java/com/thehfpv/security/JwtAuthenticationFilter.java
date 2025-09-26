package com.thehfpv.security;

import com.thehfpv.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        // Authorization 헤더가 없거나 Bearer로 시작하지 않으면 다음 필터로
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // JWT 토큰 추출
        jwt = authHeader.substring(7);
        
        try {
            // JWT에서 사용자 이메일 추출
            userEmail = jwtService.extractUsername(jwt);
            
            // 사용자 이메일이 있고 인증 컨텍스트가 비어있으면
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 사용자 정보 로드
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                // 토큰 유효성 검증
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // 인증 토큰 생성
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // 요청 세부 정보 설정
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // 보안 컨텍스트에 인증 정보 설정
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // JWT 파싱 오류 시 로그 출력 (선택사항)
            logger.error("JWT authentication failed: " + e.getMessage());
        }
        
        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}

