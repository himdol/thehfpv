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
    
    // Get all published posts (public)
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BlogPost> posts = blogService.getPublishedPosts(page, size);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts.getContent(),
                "totalPages", posts.getTotalPages(),
                "totalElements", posts.getTotalElements(),
                "currentPage", posts.getNumber()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching posts: " + e.getMessage()));
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
    public ResponseEntity<?> getPostsByCategory(@PathVariable String category) {
        try {
            List<BlogPost> posts = blogService.getPostsByCategory(category);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "posts", posts
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
            Page<BlogPost> posts = blogService.searchPublishedPosts(keyword, page, size);
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
            
            BlogPost updatedPost = new BlogPost();
            updatedPost.setTitle((String) postData.get("title"));
            updatedPost.setContent((String) postData.get("content"));
            updatedPost.setCategory((String) postData.get("category"));
            updatedPost.setTags((String) postData.get("tags"));
            updatedPost.setFeatured((Boolean) postData.getOrDefault("featured", false));
            
            // Handle publish type
            String publishType = (String) postData.getOrDefault("publishType", "immediate");
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
            
            BlogPost savedPost = blogService.updatePost(postId, updatedPost);
            
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
}
