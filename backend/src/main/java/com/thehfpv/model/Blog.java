package com.thehfpv.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
public class Blog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_id")
    @Comment("블로그 ID")
    private Long blogId;
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title")
    @Comment("블로그 제목")
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    @Comment("블로그 내용")
    private String content;
    
    @Column(name = "summary", length = 500)
    @Comment("블로그 요약")
    private String summary;
    
    @Column(name = "view_count")
    @Comment("조회수")
    private Integer viewCount = 0;
    
    @Column(name = "is_published")
    @Comment("$$code.발행상태.0=DRAFT=초안,1=PUBLISHED=발행")
    private Integer isPublished = 0; // 0=DRAFT, 1=PUBLISHED
    
    @Column(name = "is_featured")
    @Comment("$$code.추천여부.0=NO=일반,1=YES=추천")
    private Integer isFeatured = 0; // 0=NO, 1=YES
    
    @Column(name = "create_date")
    @Comment("생성일자")
    private LocalDateTime createDate;
    
    @Column(name = "update_date")
    @Comment("수정일자")
    private LocalDateTime updateDate;
    
    @Column(name = "publish_date")
    @Comment("발행일자")
    private LocalDateTime publishDate;
    
    // Foreign Key - User 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Comment("작성자 ID")
    private User user;
    
    @PrePersist
    protected void onCreate() {
        createDate = LocalDateTime.now();
        updateDate = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
    
    // Constructors
    public Blog() {}
    
    public Blog(String title, String content, User user) {
        this.title = title;
        this.content = content;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getBlogId() {
        return blogId;
    }
    
    public void setBlogId(Long blogId) {
        this.blogId = blogId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public Integer getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
    
    public Integer getIsPublished() {
        return isPublished;
    }
    
    public void setIsPublished(Integer isPublished) {
        this.isPublished = isPublished;
    }
    
    public Integer getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Integer isFeatured) {
        this.isFeatured = isFeatured;
    }
    
    public LocalDateTime getCreateDate() {
        return createDate;
    }
    
    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
    
    public LocalDateTime getUpdateDate() {
        return updateDate;
    }
    
    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }
    
    public LocalDateTime getPublishDate() {
        return publishDate;
    }
    
    public void setPublishDate(LocalDateTime publishDate) {
        this.publishDate = publishDate;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}
