package com.thehfpv.model;

/**
 * 사용자 권한 열거형
 * PUBLIC: 일반 사용자 (읽기 전용)
 * ADMIN: 관리자 (블로그 작성/수정/삭제 가능)
 * ROOT: 루트 관리자 (모든 권한)
 */
public enum UserRole {
    PUBLIC("PUBLIC", "일반 사용자"),
    ADMIN("ADMIN", "관리자"),
    ROOT("ROOT", "루트 관리자");
    
    private final String code;
    private final String description;
    
    UserRole(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 코드로 UserRole 찾기
     */
    public static UserRole fromCode(String code) {
        for (UserRole role : UserRole.values()) {
            if (role.code.equals(code)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid user role code: " + code);
    }
    
    /**
     * 블로그 작성 권한 확인
     */
    public boolean canWriteBlog() {
        return this == ADMIN || this == ROOT;
    }
    
    /**
     * 관리자 권한 확인
     */
    public boolean isAdmin() {
        return this == ADMIN || this == ROOT;
    }
    
    /**
     * 루트 관리자 권한 확인
     */
    public boolean isRoot() {
        return this == ROOT;
    }
}

