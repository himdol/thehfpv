package com.thehfpv.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "blog_posts")
public class BlogPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;
    
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @Column(name = "tags", length = 500)
    private String tags;
    
    @Column(name = "featured", nullable = false)
    private Boolean featured = false;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status = "DRAFT"; // DRAFT, PUBLISHED, SCHEDULED
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "liked_users", columnDefinition = "TEXT")
    private String likedUsers;
    
    @Column(name = "slug", unique = true, length = 255)
    private String slug;
    
    @Column(name = "excerpt", length = 500)
    private String excerpt;
    
    @Column(name = "featured_image_url", length = 500)
    private String featuredImageUrl;
    
    // Constructors
    public BlogPost() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public BlogPost(String title, String content, String category, User author) {
        this();
        this.title = title;
        this.content = content;
        this.category = category;
        this.author = author;
    }
    
    // Getters and Setters
    public Long getPostId() {
        return postId;
    }
    
    public void setPostId(Long postId) {
        this.postId = postId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Boolean getFeatured() {
        return featured;
    }
    
    public void setFeatured(Boolean featured) {
        this.featured = featured;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }
    
    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }
    
    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public User getAuthor() {
        return author;
    }
    
    public void setAuthor(User author) {
        this.author = author;
        this.updatedAt = LocalDateTime.now();
    }
    
    public Long getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }
    
    public String getLikedUsers() {
        return likedUsers;
    }
    
    public void setLikedUsers(String likedUsers) {
        this.likedUsers = likedUsers;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getExcerpt() {
        return excerpt;
    }
    
    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getFeaturedImageUrl() {
        return featuredImageUrl;
    }
    
    public void setFeaturedImageUrl(String featuredImageUrl) {
        this.featuredImageUrl = featuredImageUrl;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public boolean isPublished() {
        return "PUBLISHED".equals(this.status);
    }
    
    public boolean isDraft() {
        return "DRAFT".equals(this.status);
    }
    
    public boolean isScheduled() {
        return "SCHEDULED".equals(this.status);
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
