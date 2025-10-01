package com.thehfpv.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"post_id", "user_id"})
})
public class BlogLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private BlogPost post;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public BlogLike() {
        this.createdAt = LocalDateTime.now();
    }
    
    public BlogLike(BlogPost post, User user) {
        this.post = post;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getLikeId() {
        return likeId;
    }
    
    public void setLikeId(Long likeId) {
        this.likeId = likeId;
    }
    
    public BlogPost getPost() {
        return post;
    }
    
    public void setPost(BlogPost post) {
        this.post = post;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

