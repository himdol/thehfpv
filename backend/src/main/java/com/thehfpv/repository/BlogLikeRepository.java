package com.thehfpv.repository;

import com.thehfpv.model.BlogLike;
import com.thehfpv.model.BlogPost;
import com.thehfpv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogLikeRepository extends JpaRepository<BlogLike, Long> {
    
    // Find like by post and user
    Optional<BlogLike> findByPostAndUser(BlogPost post, User user);
    
    // Check if user liked a post
    boolean existsByPostAndUser(BlogPost post, User user);
    
    // Count likes for a post
    long countByPost(BlogPost post);
    
    // Get all likes by user (for "My Likes" feature)
    List<BlogLike> findByUserOrderByCreatedAtDesc(User user);
    
    // Get all posts liked by user
    @Query("SELECT bl.post FROM BlogLike bl WHERE bl.user = :user ORDER BY bl.createdAt DESC")
    List<BlogPost> findPostsLikedByUser(@Param("user") User user);
    
    // Delete like by post and user
    void deleteByPostAndUser(BlogPost post, User user);
}

