package com.thehfpv.repository;

import com.thehfpv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    // 활성 사용자만 조회
    List<User> findByUserStatus(Integer userStatus);
}
