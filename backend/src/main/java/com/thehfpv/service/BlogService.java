package com.thehfpv.service;

import com.thehfpv.model.BlogPost;
import com.thehfpv.model.User;
import com.thehfpv.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@Transactional
public class BlogService {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    // Create a new blog post
    public BlogPost createPost(BlogPost blogPost) {
        // Generate slug if not provided
        if (blogPost.getSlug() == null || blogPost.getSlug().isEmpty()) {
            blogPost.setSlug(generateSlug(blogPost.getTitle()));
        }
        
        // Ensure slug is unique
        blogPost.setSlug(ensureUniqueSlug(blogPost.getSlug()));
        
        // Set default values
        if (blogPost.getStatus() == null) {
            blogPost.setStatus("DRAFT");
        }
        
        if (blogPost.getFeatured() == null) {
            blogPost.setFeatured(false);
        }
        
        if (blogPost.getViewCount() == null) {
            blogPost.setViewCount(0L);
        }
        
        return blogPostRepository.save(blogPost);
    }
    
    // Update an existing blog post
    public BlogPost updatePost(Long postId, BlogPost updatedPost) {
        BlogPost existingPost = blogPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        
        // Update fields
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setCategory(updatedPost.getCategory());
        existingPost.setTags(updatedPost.getTags());
        existingPost.setFeatured(updatedPost.getFeatured());
        existingPost.setStatus(updatedPost.getStatus());
        existingPost.setScheduledAt(updatedPost.getScheduledAt());
        existingPost.setExcerpt(updatedPost.getExcerpt());
        existingPost.setFeaturedImageUrl(updatedPost.getFeaturedImageUrl());
        
        // Update slug if title changed
        if (!existingPost.getTitle().equals(updatedPost.getTitle())) {
            String newSlug = generateSlug(updatedPost.getTitle());
            existingPost.setSlug(ensureUniqueSlug(newSlug, postId));
        }
        
        // Set published date if status changed to PUBLISHED
        if ("PUBLISHED".equals(updatedPost.getStatus()) && existingPost.getPublishedAt() == null) {
            existingPost.setPublishedAt(LocalDateTime.now());
        }
        
        return blogPostRepository.save(existingPost);
    }
    
    // Get post by ID
    @Transactional(readOnly = true)
    public Optional<BlogPost> getPostById(Long postId) {
        return blogPostRepository.findById(postId);
    }
    
    // Get published post by slug
    @Transactional(readOnly = true)
    public Optional<BlogPost> getPublishedPostBySlug(String slug) {
        return blogPostRepository.findBySlugAndStatus(slug, "PUBLISHED");
    }
    
    // Get all published posts
    @Transactional(readOnly = true)
    public List<BlogPost> getAllPublishedPosts() {
        return blogPostRepository.findByStatusOrderByPublishedAtDesc("PUBLISHED");
    }
    
    // Get published posts with pagination
    @Transactional(readOnly = true)
    public Page<BlogPost> getPublishedPosts(int page, int size) {
        // Use created_at as fallback when published_at is null
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // Get published posts with pagination directly from repository
        Page<BlogPost> result = blogPostRepository.findByStatusOrderByCreatedAtDesc("PUBLISHED", pageable);
        
        System.out.println("=== DEBUG: Published posts ===");
        System.out.println("Found " + result.getTotalElements() + " total published posts");
        System.out.println("Page content size: " + result.getContent().size());
        
        return result;
    }
    
    
    
    
    // Get featured posts
    @Transactional(readOnly = true)
    public List<BlogPost> getFeaturedPosts() {
        return blogPostRepository.findByFeaturedAndStatusOrderByPublishedAtDesc(true, "PUBLISHED");
    }
    
    // Get posts by category
    @Transactional(readOnly = true)
    public List<BlogPost> getPostsByCategory(String category) {
        return blogPostRepository.findByCategoryAndStatusOrderByPublishedAtDesc(category, "PUBLISHED");
    }
    
    // Get posts by category with pagination
    @Transactional(readOnly = true)
    public Page<BlogPost> getPostsByCategory(String category, int page, int size) {
        // Use created_at as fallback when published_at is null
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Get posts by category with pagination directly from repository
        Page<BlogPost> result = blogPostRepository.findByCategoryAndStatusOrderByPublishedAtDesc(category, "PUBLISHED", pageable);
        
        System.out.println("=== DEBUG: Category posts ===");
        System.out.println("Found " + result.getTotalElements() + " total posts in category: " + category);
        System.out.println("Page content size: " + result.getContent().size());

        return result;
    }
    
    // Get posts by author
    @Transactional(readOnly = true)
    public List<BlogPost> getPostsByAuthor(User author) {
        return blogPostRepository.findByAuthorOrderByCreatedAtDesc(author);
    }
    
    // Get posts by author with pagination
    @Transactional(readOnly = true)
    public Page<BlogPost> getPostsByAuthor(User author, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogPostRepository.findByAuthorOrderByCreatedAtDesc(author, pageable);
    }
    
    // Get author's posts by status
    @Transactional(readOnly = true)
    public List<BlogPost> getAuthorPostsByStatus(User author, String status) {
        return blogPostRepository.findByAuthorAndStatusOrderByCreatedAtDesc(author, status);
    }
    
    // Search published posts
    @Transactional(readOnly = true)
    public List<BlogPost> searchPublishedPosts(String keyword) {
        return blogPostRepository.searchPublishedPosts(keyword);
    }
    
    // Search published posts with pagination
    @Transactional(readOnly = true)
    public Page<BlogPost> searchPublishedPosts(String keyword, int page, int size) {
        // Use created_at as fallback when published_at is null
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Use repository search method with pagination
        Page<BlogPost> result = blogPostRepository.searchPublishedPosts(keyword, pageable);
        
        System.out.println("=== DEBUG: Search results ===");
        System.out.println("Found " + result.getTotalElements() + " posts matching keyword: " + keyword);
        System.out.println("Page content size: " + result.getContent().size());

        return result;
    }
    
    // Get recent posts
    @Transactional(readOnly = true)
    public List<BlogPost> getRecentPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("publishedAt").descending());
        return blogPostRepository.findRecentPublishedPosts(pageable);
    }
    
    // Get most viewed posts
    @Transactional(readOnly = true)
    public List<BlogPost> getMostViewedPosts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("viewCount").descending());
        return blogPostRepository.findMostViewedPosts(pageable);
    }
    
    // Get related posts
    @Transactional(readOnly = true)
    public List<BlogPost> getRelatedPosts(String category, Long excludeId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("publishedAt").descending());
        return blogPostRepository.findRelatedPosts(category, excludeId, pageable);
    }
    
    // Increment view count
    public void incrementViewCount(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        post.incrementViewCount();
        blogPostRepository.save(post);
    }
    
    // Publish post
    public BlogPost publishPost(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        
        post.setStatus("PUBLISHED");
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        
        return blogPostRepository.save(post);
    }
    
    // Unpublish post (set to draft)
    public BlogPost unpublishPost(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        
        post.setStatus("DRAFT");
        return blogPostRepository.save(post);
    }
    
    // Schedule post
    public BlogPost schedulePost(Long postId, LocalDateTime scheduledAt) {
        BlogPost post = blogPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        
        post.setStatus("SCHEDULED");
        post.setScheduledAt(scheduledAt);
        
        return blogPostRepository.save(post);
    }
    
    // Delete post
    public void deletePost(Long postId) {
        if (!blogPostRepository.existsById(postId)) {
            throw new RuntimeException("Blog post not found with id: " + postId);
        }
        blogPostRepository.deleteById(postId);
    }
    
    // Get scheduled posts that should be published
    @Transactional(readOnly = true)
    public List<BlogPost> getScheduledPostsToPublish() {
        return blogPostRepository.findScheduledPostsToPublish(LocalDateTime.now());
    }
    
    // Publish scheduled posts
    public List<BlogPost> publishScheduledPosts() {
        List<BlogPost> scheduledPosts = getScheduledPostsToPublish();
        for (BlogPost post : scheduledPosts) {
            post.setStatus("PUBLISHED");
            if (post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
        }
        return blogPostRepository.saveAll(scheduledPosts);
    }
    
    // Get post statistics
    @Transactional(readOnly = true)
    public long getTotalPostsCount() {
        return blogPostRepository.count();
    }
    
    @Transactional(readOnly = true)
    public long getPublishedPostsCount() {
        return blogPostRepository.countByStatus("PUBLISHED");
    }
    
    @Transactional(readOnly = true)
    public long getDraftPostsCount() {
        return blogPostRepository.countByStatus("DRAFT");
    }
    
    @Transactional(readOnly = true)
    public long getScheduledPostsCount() {
        return blogPostRepository.countByStatus("SCHEDULED");
    }
    
    // Helper methods
    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return UUID.randomUUID().toString();
        }
        
        return title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .trim();
    }
    
    private String ensureUniqueSlug(String slug) {
        return ensureUniqueSlug(slug, null);
    }
    
    private String ensureUniqueSlug(String slug, Long excludeId) {
        String originalSlug = slug;
        int counter = 1;
        
        while (true) {
            boolean exists;
            if (excludeId != null) {
                exists = blogPostRepository.existsBySlugAndPostIdNot(slug, excludeId);
            } else {
                exists = blogPostRepository.existsBySlug(slug);
            }
            
            if (!exists) {
                break;
            }
            
            slug = originalSlug + "-" + counter;
            counter++;
        }
        
        return slug;
    }
}
