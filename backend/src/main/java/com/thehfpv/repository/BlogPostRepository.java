package com.thehfpv.repository;

import com.thehfpv.model.BlogPost;
import com.thehfpv.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    // Find published posts
    List<BlogPost> findByStatusOrderByPublishedAtDesc(String status);
    
    // Find published posts with pagination
    Page<BlogPost> findByStatusOrderByPublishedAtDesc(String status, Pageable pageable);
    
    // Find posts by status ordered by created_at (fallback for null published_at)
    List<BlogPost> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find posts by status ordered by created_at with pagination
    @Query("SELECT bp FROM BlogPost bp LEFT JOIN FETCH bp.author WHERE bp.status = :status ORDER BY bp.createdAt DESC")
    Page<BlogPost> findByStatusOrderByCreatedAtDesc(@Param("status") String status, Pageable pageable);
    
    // Find featured posts
    List<BlogPost> findByFeaturedAndStatusOrderByPublishedAtDesc(Boolean featured, String status);
    
    // Find posts by category
    List<BlogPost> findByCategoryAndStatusOrderByPublishedAtDesc(String category, String status);
    
    // Find posts by category with pagination
    @Query("SELECT bp FROM BlogPost bp LEFT JOIN FETCH bp.author WHERE bp.category = :category AND bp.status = :status ORDER BY bp.publishedAt DESC")
    Page<BlogPost> findByCategoryAndStatusOrderByPublishedAtDesc(@Param("category") String category, @Param("status") String status, Pageable pageable);
    
    // Find all posts by category (for ROOT users) with pagination
    @Query("SELECT bp FROM BlogPost bp LEFT JOIN FETCH bp.author WHERE bp.category = :category ORDER BY bp.createdAt DESC")
    Page<BlogPost> findByCategoryOrderByCreatedAtDesc(@Param("category") String category, Pageable pageable);
    
    // Find posts by author
    List<BlogPost> findByAuthorOrderByCreatedAtDesc(User author);
    
    // Find posts by author with pagination
    Page<BlogPost> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);
    
    // Find posts by author and status
    List<BlogPost> findByAuthorAndStatusOrderByCreatedAtDesc(User author, String status);
    
    // Find posts by author and status with pagination
    Page<BlogPost> findByAuthorAndStatusOrderByCreatedAtDesc(User author, String status, Pageable pageable);
    
    // Find posts by slug
    Optional<BlogPost> findBySlug(String slug);
    
    // Find posts by slug and status
    Optional<BlogPost> findBySlugAndStatus(String slug, String status);
    
    // Find scheduled posts that should be published
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'SCHEDULED' AND bp.scheduledAt <= :now")
    List<BlogPost> findScheduledPostsToPublish(@Param("now") LocalDateTime now);
    
    // Search posts by title or content
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' AND " +
           "(LOWER(bp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY bp.publishedAt DESC")
    List<BlogPost> searchPublishedPosts(@Param("keyword") String keyword);
    
    // Search posts by title or content with pagination
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' AND " +
           "(LOWER(bp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY bp.publishedAt DESC")
    Page<BlogPost> searchPublishedPosts(@Param("keyword") String keyword, Pageable pageable);
    
    // Search all posts (for ROOT users) with pagination
    @Query("SELECT bp FROM BlogPost bp WHERE " +
           "(LOWER(bp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY bp.createdAt DESC")
    Page<BlogPost> searchAllPosts(@Param("keyword") String keyword, Pageable pageable);
    
    // Find recent posts
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' " +
           "ORDER BY bp.publishedAt DESC")
    List<BlogPost> findRecentPublishedPosts(Pageable pageable);
    
    // Find posts by date range
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' AND " +
           "bp.publishedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY bp.publishedAt DESC")
    List<BlogPost> findPublishedPostsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
    
    // Count posts by status
    long countByStatus(String status);
    
    // Count posts by author and status
    long countByAuthorAndStatus(User author, String status);
    
    // Count posts by category and status
    long countByCategoryAndStatus(String category, String status);
    
    // Find posts with most views
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' " +
           "ORDER BY bp.viewCount DESC")
    List<BlogPost> findMostViewedPosts(Pageable pageable);
    
    // Find related posts (same category, excluding current post)
    @Query("SELECT bp FROM BlogPost bp WHERE bp.status = 'PUBLISHED' AND " +
           "bp.category = :category AND bp.postId != :excludeId " +
           "ORDER BY bp.publishedAt DESC")
    List<BlogPost> findRelatedPosts(@Param("category") String category, 
                                   @Param("excludeId") Long excludeId, 
                                   Pageable pageable);
    
    // Check if slug exists
    boolean existsBySlug(String slug);
    
    // Check if slug exists excluding current post
    boolean existsBySlugAndPostIdNot(String slug, Long postId);
}
