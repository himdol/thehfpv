package com.thehfpv.controller;

import com.thehfpv.model.BlogPost;
import com.thehfpv.model.User;
import com.thehfpv.service.BlogService;
import com.thehfpv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/blog")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BlogController {
    
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new blog post
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> postData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            BlogPost blogPost = new BlogPost();
            blogPost.setTitle((String) postData.get("title"));
            blogPost.setContent((String) postData.get("content"));
            blogPost.setCategory((String) postData.get("category"));
            blogPost.setTags((String) postData.get("tags"));
            blogPost.setFeatured((Boolean) postData.getOrDefault("featured", false));
            blogPost.setAuthor(author);
            
            // Handle publish type
            String publishType = (String) postData.getOrDefault("publishType", "immediate");
            if ("immediate".equals(publishType)) {
                blogPost.setStatus("PUBLISHED");
                blogPost.setPublishedAt(LocalDateTime.now());
            } else if ("scheduled".equals(publishType)) {
                String scheduledDate = (String) postData.get("scheduledDate");
                String scheduledTime = (String) postData.get("scheduledTime");
                if (scheduledDate != null && scheduledTime != null) {
                    LocalDateTime scheduledAt = LocalDateTime.parse(
                        scheduledDate + "T" + scheduledTime,
                        DateTimeFormatter.ISO_LOCAL_DATE_TIME
                    );
                    blogPost.setStatus("SCHEDULED");
                    blogPost.setScheduledAt(scheduledAt);
                } else {
                    blogPost.setStatus("DRAFT");
                }
            } else {
                blogPost.setStatus("DRAFT");
            }
            
            BlogPost savedPost = blogService.createPost(blogPost);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Blog post created successfully",
                "post", savedPost
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error creating blog post: " + e.getMessage()));
        }
    }
    
    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(Map.of("success", true, "message", "Test endpoint works"));
    }

    // Get all published posts (public)
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Convert 1-based page to 0-based page for frontend compatibility
        if (page > 0) {
            page = page - 1;
        }
        try {
            System.out.println("=== getAllPublishedPosts called ===");
            System.out.println("Page: " + page + ", Size: " + size);
            
            // Get current user if authenticated
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long currentUserId = null;
            boolean isRootUser = false;
            
            if (auth != null && auth.isAuthenticated() && !(auth.getPrincipal() instanceof String && "anonymousUser".equals(auth.getPrincipal()))) {
                String email = auth.getName();
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    currentUserId = user.getUserId();
                    isRootUser = user.getUserRole() == com.thehfpv.model.UserRole.ROOT;
                    System.out.println("=== User Role Check ===");
                    System.out.println("User email: " + email);
                    System.out.println("User role: " + user.getUserRole());
                    System.out.println("Is ROOT? " + isRootUser);
                }
            }
            
            // ROOT users see all posts, others see only published posts
            Page<BlogPost> posts;
            if (isRootUser) {
                System.out.println("ROOT user detected - fetching all posts including DRAFT");
                posts = blogService.getAllPostsForAdmin(page, size);
            } else {
                System.out.println("Regular user - fetching published posts only");
                posts = blogService.getPublishedPosts(page, size);
            }
            
            System.out.println("Found " + posts.getTotalElements() + " posts");
            System.out.println("Posts content size: " + posts.getContent().size());
            System.out.println("Posts content: " + posts.getContent());
            
            // Transform posts to include like count and user's like status
            List<Map<String, Object>> transformedPosts = new ArrayList<>();
            for (BlogPost post : posts.getContent()) {
                Map<String, Object> postMap = new HashMap<>();
                postMap.put("postId", post.getPostId());
                postMap.put("title", post.getTitle());
                postMap.put("content", post.getContent());
                postMap.put("excerpt", post.getExcerpt());
                postMap.put("category", post.getCategory());
                postMap.put("tags", post.getTags());
                postMap.put("featured", post.getFeatured());
                postMap.put("featuredImageUrl", post.getFeaturedImageUrl());
                postMap.put("slug", post.getSlug());
                postMap.put("status", post.getStatus());
                postMap.put("createdAt", post.getCreatedAt());
                postMap.put("publishedAt", post.getPublishedAt());
                postMap.put("updatedAt", post.getUpdatedAt());
                postMap.put("viewCount", post.getViewCount());
                postMap.put("likeCount", blogService.getLikeCount(post.getPostId()));
                
                // Add user's like status if authenticated
                if (currentUserId != null) {
                    postMap.put("isLiked", blogService.isLikedByUser(post.getPostId(), currentUserId));
                } else {
                    postMap.put("isLiked", false);
                }
                
                postMap.put("author", post.getAuthor());
                transformedPosts.add(postMap);
                
                System.out.println("Post ID: " + post.getPostId() + 
                    ", Title: " + post.getTitle() + 
                    ", Status: " + post.getStatus() + 
                    ", PublishedAt: " + post.getPublishedAt() +
                    ", ViewCount: " + post.getViewCount() +
                    ", LikeCount: " + blogService.getLikeCount(post.getPostId()) +
                    ", IsLiked: " + (currentUserId != null ? blogService.isLikedByUser(post.getPostId(), currentUserId) : false) +
                    ", Author: " + (post.getAuthor() != null ? post.getAuthor().getFirstName() : "null"));
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "posts", transformedPosts,
                "totalPages", posts.getTotalPages(),
                "totalElements", posts.getTotalElements(),
                "currentPage", posts.getNumber()
            );
            
            System.out.println("Response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getAllPublishedPosts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching posts: " + e.getMessage()));
        }
    }

    // Get a specific blog post by ID
    @GetMapping("/posts/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try {
            System.out.println("=== getPostById called ===");
            System.out.println("Post ID: " + id);
            
            Optional<BlogPost> postOpt = blogService.getPostById(id);
            
            if (!postOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
            
            BlogPost post = postOpt.get();
            
            // Check if post is published
            if (!"PUBLISHED".equals(post.getStatus())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
            
            System.out.println("Found post: " + post.getTitle() + " by " + 
                             (post.getAuthor() != null ? post.getAuthor().getFirstName() : "Unknown"));
            
            // Increment view count
            blogService.incrementViewCount(post.getPostId());
            
            // Refresh post to get updated view count
            post = blogService.getPostById(id).orElse(post);
            
            Map<String, Object> response = new HashMap<>();
            response.put("postId", post.getPostId());
            response.put("title", post.getTitle());
            response.put("content", post.getContent());
            response.put("excerpt", post.getExcerpt());
            response.put("category", post.getCategory());
            response.put("tags", post.getTags());
            response.put("featured", post.getFeatured());
            response.put("featuredImageUrl", post.getFeaturedImageUrl());
            response.put("slug", post.getSlug());
            response.put("status", post.getStatus());
            response.put("createdAt", post.getCreatedAt());
            response.put("publishedAt", post.getPublishedAt());
            response.put("updatedAt", post.getUpdatedAt());
            response.put("viewCount", post.getViewCount());
            response.put("likeCount", blogService.getLikeCount(post.getPostId()));
            response.put("author", post.getAuthor());
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getPostById: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Failed to fetch post: " + e.getMessage()));
        }
    }
    
    // Get post by slug (public)
    @GetMapping("/posts/slug/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable String slug) {
        try {
            Optional<BlogPost> post = blogService.getPublishedPostBySlug(slug);
            if (post.isPresent()) {
                // Increment view count
                blogService.incrementViewCount(post.get().getPostId());
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "post", post.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching post: " + e.getMessage()));
        }
    }
    
    // Get featured posts (public)
    @GetMapping("/posts/featured")
    public ResponseEntity<?> getFeaturedPosts() {
        try {
            List<BlogPost> posts = blogService.getFeaturedPosts();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching featured posts: " + e.getMessage()));
        }
    }
    
    // Get posts by category (public)
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<?> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Convert 1-based page to 0-based page for frontend compatibility
            if (page > 0) {
                page = page - 1;
            }
            
            // Get current user if authenticated
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isRootUser = false;
            
            if (auth != null && auth.isAuthenticated() && !(auth.getPrincipal() instanceof String && "anonymousUser".equals(auth.getPrincipal()))) {
                String email = auth.getName();
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    isRootUser = user.getUserRole() == com.thehfpv.model.UserRole.ROOT;
                }
            }
            
            // ROOT users see all posts, others see only published posts
            Page<BlogPost> posts;
            if (isRootUser) {
                System.out.println("ROOT user detected - fetching all posts in category including DRAFT");
                posts = blogService.getAllPostsByCategoryForAdmin(category, page, size);
            } else {
                System.out.println("Regular user - fetching published posts only in category");
                posts = blogService.getPostsByCategory(category, page, size);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts.getContent(),
                "totalPages", posts.getTotalPages(),
                "totalElements", posts.getTotalElements(),
                "currentPage", posts.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching posts by category: " + e.getMessage()));
        }
    }
    
    // Search posts (public)
    @GetMapping("/posts/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Get current user if authenticated
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isRootUser = false;
            
            if (auth != null && auth.isAuthenticated() && !(auth.getPrincipal() instanceof String && "anonymousUser".equals(auth.getPrincipal()))) {
                String email = auth.getName();
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    isRootUser = user.getUserRole() == com.thehfpv.model.UserRole.ROOT;
                }
            }
            
            // ROOT users search all posts, others search only published posts
            Page<BlogPost> posts;
            if (isRootUser) {
                System.out.println("ROOT user detected - searching all posts including DRAFT");
                posts = blogService.searchAllPostsForAdmin(keyword, page, size);
            } else {
                System.out.println("Regular user - searching published posts only");
                posts = blogService.searchPublishedPosts(keyword, page, size);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts.getContent(),
                "totalPages", posts.getTotalPages(),
                "totalElements", posts.getTotalElements(),
                "currentPage", posts.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error searching posts: " + e.getMessage()));
        }
    }
    
    // Get recent posts (public)
    @GetMapping("/posts/recent")
    public ResponseEntity<?> getRecentPosts(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<BlogPost> posts = blogService.getRecentPosts(limit);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching recent posts: " + e.getMessage()));
        }
    }
    
    // Get most viewed posts (public)
    @GetMapping("/posts/popular")
    public ResponseEntity<?> getMostViewedPosts(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<BlogPost> posts = blogService.getMostViewedPosts(limit);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching popular posts: " + e.getMessage()));
        }
    }
    
    // Get author's posts (authenticated)
    @GetMapping("/my-posts")
    public ResponseEntity<?> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            Page<BlogPost> posts = blogService.getPostsByAuthor(author, page, size);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts.getContent(),
                "totalPages", posts.getTotalPages(),
                "totalElements", posts.getTotalElements(),
                "currentPage", posts.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching your posts: " + e.getMessage()));
        }
    }
    
    // Get author's posts by status (authenticated)
    @GetMapping("/my-posts/status/{status}")
    public ResponseEntity<?> getMyPostsByStatus(@PathVariable String status) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            List<BlogPost> posts = blogService.getAuthorPostsByStatus(author, status);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching posts: " + e.getMessage()));
        }
    }
    
    // Update post (authenticated - author only)
    @PutMapping("/posts/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Map<String, Object> postData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            Optional<BlogPost> existingPost = blogService.getPostById(postId);
            if (!existingPost.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
            
            // Check if user is the author
            if (!existingPost.get().getAuthor().getUserId().equals(author.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only edit your own posts"));
            }
            
            System.out.println("=== Update Post Request ===");
            System.out.println("Post ID: " + postId);
            System.out.println("Request Data: " + postData);
            
            BlogPost updatedPost = new BlogPost();
            updatedPost.setTitle((String) postData.get("title"));
            updatedPost.setContent((String) postData.get("content"));
            updatedPost.setCategory((String) postData.get("category"));
            updatedPost.setTags((String) postData.get("tags"));
            updatedPost.setFeatured((Boolean) postData.getOrDefault("featured", false));
            
            // Handle status - if status is directly provided, use it (for unpublish)
            String directStatus = (String) postData.get("status");
            System.out.println("Direct Status from request: " + directStatus);
            
            if (directStatus != null) {
                updatedPost.setStatus(directStatus);
                System.out.println("Setting status directly to: " + directStatus);
            } else {
                // Handle publish type
                String publishType = (String) postData.getOrDefault("publishType", "immediate");
                System.out.println("No direct status, using publishType: " + publishType);
                
                if ("immediate".equals(publishType)) {
                    updatedPost.setStatus("PUBLISHED");
                } else if ("scheduled".equals(publishType)) {
                    String scheduledDate = (String) postData.get("scheduledDate");
                    String scheduledTime = (String) postData.get("scheduledTime");
                    if (scheduledDate != null && scheduledTime != null) {
                        LocalDateTime scheduledAt = LocalDateTime.parse(
                            scheduledDate + "T" + scheduledTime,
                            DateTimeFormatter.ISO_LOCAL_DATE_TIME
                        );
                        updatedPost.setStatus("SCHEDULED");
                        updatedPost.setScheduledAt(scheduledAt);
                    } else {
                        updatedPost.setStatus("DRAFT");
                    }
                } else {
                    updatedPost.setStatus("DRAFT");
                }
            }
            
            System.out.println("Final status being set: " + updatedPost.getStatus());
            
            BlogPost savedPost = blogService.updatePost(postId, updatedPost);
            
            System.out.println("=== AFTER SAVING TO DB ===");
            System.out.println("Saved Post ID: " + savedPost.getPostId());
            System.out.println("Saved Post Status: " + savedPost.getStatus());
            System.out.println("Saved Post Title: " + savedPost.getTitle());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Blog post updated successfully",
                "post", savedPost
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error updating blog post: " + e.getMessage()));
        }
    }
    
    // Delete post (authenticated - author only)
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            Optional<BlogPost> existingPost = blogService.getPostById(postId);
            if (!existingPost.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
            
            // Check if user is the author
            if (!existingPost.get().getAuthor().getUserId().equals(author.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only delete your own posts"));
            }
            
            blogService.deletePost(postId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Blog post deleted successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error deleting blog post: " + e.getMessage()));
        }
    }
    
    // Publish post (authenticated - author only)
    @PostMapping("/posts/{postId}/publish")
    public ResponseEntity<?> publishPost(@PathVariable Long postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User author = userOpt.get();
            
            Optional<BlogPost> existingPost = blogService.getPostById(postId);
            if (!existingPost.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Post not found"));
            }
            
            // Check if user is the author
            if (!existingPost.get().getAuthor().getUserId().equals(author.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "You can only publish your own posts"));
            }
            
            BlogPost publishedPost = blogService.publishPost(postId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Blog post published successfully",
                "post", publishedPost
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error publishing blog post: " + e.getMessage()));
        }
    }
    
    // Get blog statistics (authenticated)
    @GetMapping("/stats")
    public ResponseEntity<?> getBlogStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPosts", blogService.getTotalPostsCount());
            stats.put("publishedPosts", blogService.getPublishedPostsCount());
            stats.put("draftPosts", blogService.getDraftPostsCount());
            stats.put("scheduledPosts", blogService.getScheduledPostsCount());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", stats
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching blog stats: " + e.getMessage()));
        }
    }

    // Toggle like for a blog post
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User user = userOpt.get();
            
            boolean isLiked = blogService.toggleLike(id, user.getUserId());
            int likeCount = blogService.getLikeCount(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isLiked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in toggleLike: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Failed to toggle like: " + e.getMessage()));
        }
    }

    // Get like status for a blog post
    @GetMapping("/posts/{id}/like-status")
    public ResponseEntity<?> getLikeStatus(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User user = userOpt.get();
            
            boolean isLiked = blogService.isLikedByUser(id, user.getUserId());
            int likeCount = blogService.getLikeCount(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isLiked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getLikeStatus: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Failed to get like status: " + e.getMessage()));
        }
    }
    
    // Get posts liked by current user
    @GetMapping("/my-likes")
    public ResponseEntity<?> getMyLikes() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }
            
            String email = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            User user = userOpt.get();
            
            List<BlogPost> likedPosts = blogService.getPostsLikedByUser(user.getUserId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", likedPosts,
                "totalLikes", likedPosts.size()
            ));
        } catch (Exception e) {
            System.err.println("Error in getMyLikes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Failed to get liked posts: " + e.getMessage()));
        }
    }
    
    // Get total published posts count
    @GetMapping("/stats/total")
    public ResponseEntity<?> getTotalPostsCount() {
        try {
            long totalCount = blogService.getTotalPublishedPostsCount();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "totalPosts", totalCount
            ));
        } catch (Exception e) {
            System.err.println("Error in getTotalPostsCount: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Failed to get total posts count: " + e.getMessage()));
        }
    }
}
