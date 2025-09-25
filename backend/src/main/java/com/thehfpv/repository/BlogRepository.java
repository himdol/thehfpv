package com.thehfpv.repository;

import com.thehfpv.model.Blog;
import com.thehfpv.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // 발행된 블로그만 조회
    List<Blog> findByIsPublished(Integer isPublished);
    
    // 발행된 블로그 페이징 조회
    Page<Blog> findByIsPublished(Integer isPublished, Pageable pageable);
    
    // 사용자별 블로그 조회
    List<Blog> findByUser(User user);
    
    // 사용자별 발행된 블로그 조회
    List<Blog> findByUserAndIsPublished(User user, Integer isPublished);
    
    // 추천 블로그 조회
    List<Blog> findByIsFeaturedAndIsPublished(Integer isFeatured, Integer isPublished);
    
    // 제목으로 검색
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% AND b.isPublished = 1")
    List<Blog> findByTitleContainingAndPublished(@Param("keyword") String keyword);
    
    // 내용으로 검색
    @Query("SELECT b FROM Blog b WHERE b.content LIKE %:keyword% AND b.isPublished = 1")
    List<Blog> findByContentContainingAndPublished(@Param("keyword") String keyword);
    
    // 조회수 순으로 정렬
    @Query("SELECT b FROM Blog b WHERE b.isPublished = 1 ORDER BY b.viewCount DESC")
    List<Blog> findPublishedBlogsOrderByViewCount();
    
    // 최신 발행 블로그 조회
    @Query("SELECT b FROM Blog b WHERE b.isPublished = 1 ORDER BY b.publishDate DESC")
    List<Blog> findPublishedBlogsOrderByPublishDate();
}
