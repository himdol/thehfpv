package com.thehfpv.controller;

import com.thehfpv.model.User;
import com.thehfpv.model.UserRole;
import com.thehfpv.repository.UserRepository;
import com.thehfpv.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                         JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Map<String, String> registerRequest) {
        try {
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String firstName = registerRequest.get("firstName");
            String lastName = registerRequest.get("lastName");
            
            // 이메일 중복 확인
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Error: Email is already in use!"));
            }
            
            // 새 사용자 생성
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password)); // 비밀번호 해시화
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setUserRole(UserRole.PUBLIC); // 기본 권한은 PUBLIC
            newUser.setEmailVerified(false); // 이메일 인증 필요
            
            User savedUser = userRepository.save(newUser);
            
            // 응답에 사용자 정보와 날짜 포함
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd-yyyy HH:mm:ss");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully! Please verify your email.");
            response.put("user", Map.of(
                "userId", savedUser.getUserId(),
                "email", savedUser.getEmail(),
                "firstName", savedUser.getFirstName(),
                "lastName", savedUser.getLastName(),
                "userRole", savedUser.getUserRole().getCode(),
                "emailVerified", savedUser.getEmailVerified(),
                "createDate", savedUser.getCreateDate().format(formatter),
                "updateDate", savedUser.getUpdateDate().format(formatter)
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            System.out.println("Login request received: " + loginRequest);
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            System.out.println("Email: " + email);
            System.out.println("Password length: " + (password != null ? password.length() : "null"));
            
            // 인증 처리
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            
            // 사용자 정보 조회
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 개발 단계에서는 이메일 인증을 건너뛰고, 자동으로 인증 완료 처리
            if (!user.getEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
            }
            
            // JWT 토큰 생성
            String jwtToken = jwtService.generateToken(user);
            
            // 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", jwtToken);
            response.put("user", Map.of(
                "userId", user.getUserId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "userRole", user.getUserRole().getCode(),
                "emailVerified", user.getEmailVerified()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace(); // 스택 트레이스 출력
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            
            User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "프로필 정보 조회 성공");
            response.put("user", Map.of(
                "userId", currentUser.getUserId(),
                "email", currentUser.getEmail(),
                "firstName", currentUser.getFirstName(),
                "lastName", currentUser.getLastName(),
                "userRole", currentUser.getUserRole().getCode(),
                "emailVerified", currentUser.getEmailVerified()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("프로필 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateRequest) {
        try {
            System.out.println("Profile update request received: " + updateRequest);
            System.out.println("Request keys: " + updateRequest.keySet());
            System.out.println("Request values: " + updateRequest.values());
            
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            
            System.out.println("Current user email: " + currentUserEmail);
            
            User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // 개인정보 수정인지 비밀번호 변경인지 확인
            if (updateRequest.containsKey("currentPassword") && updateRequest.containsKey("newPassword")) {
                // 비밀번호 변경
                String currentPassword = updateRequest.get("currentPassword");
                String newPassword = updateRequest.get("newPassword");
                
                System.out.println("Password change attempt:");
                System.out.println("Current password from request: " + currentPassword);
                System.out.println("Stored password hash: " + currentUser.getPassword());
                
                // 현재 비밀번호 확인
                boolean passwordMatches = passwordEncoder.matches(currentPassword, currentUser.getPassword());
                System.out.println("Password matches: " + passwordMatches);
                
                if (!passwordMatches) {
                    System.out.println("Password verification failed - returning error");
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("현재 비밀번호가 일치하지 않습니다."));
                }
                
                System.out.println("Password verification successful - updating password");
                // 새 비밀번호로 업데이트
                currentUser.setPassword(passwordEncoder.encode(newPassword));
                
            } else {
                // 개인정보 수정 (이메일 제외)
                if (updateRequest.containsKey("firstName")) {
                    currentUser.setFirstName(updateRequest.get("firstName"));
                }
                if (updateRequest.containsKey("lastName")) {
                    currentUser.setLastName(updateRequest.get("lastName"));
                }
                // 이메일은 변경 불가능 (소셜 로그인 연동을 위해)
            }
            
            // 업데이트 시간 설정
            currentUser.setUpdateDate(LocalDateTime.now());
            
            // 사용자 정보 저장
            User updatedUser = userRepository.save(currentUser);
            
            // 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "프로필이 성공적으로 수정되었습니다.");
            response.put("user", Map.of(
                "userId", updatedUser.getUserId(),
                "email", updatedUser.getEmail(),
                "firstName", updatedUser.getFirstName(),
                "lastName", updatedUser.getLastName(),
                "userRole", updatedUser.getUserRole().getCode(),
                "emailVerified", updatedUser.getEmailVerified()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(createErrorResponse("프로필 수정 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
    
    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}
