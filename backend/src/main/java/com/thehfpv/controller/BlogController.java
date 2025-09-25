package com.thehfpv.controller;

import com.thehfpv.model.Blog;
import com.thehfpv.model.User;
import com.thehfpv.repository.BlogRepository;
import com.thehfpv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/blogs")
@CrossOrigin(origins = "http://localhost:3000")
public class BlogController {
    
    @Autowired
    private BlogRepository blogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // 모든 발행된 블로그 조회 (페이징)
    @GetMapping
    public ResponseEntity<?> getAllPublishedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Blog> blogs = blogRepository.findByIsPublished(1, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("blogs", blogs.getContent());
            response.put("currentPage", blogs.getNumber());
            response.put("totalItems", blogs.getTotalElements());
            response.put("totalPages", blogs.getTotalPages());
            response.put("hasNext", blogs.hasNext());
            response.put("hasPrevious", blogs.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 블로그 상세 조회
    @GetMapping("/{blogId}")
    public ResponseEntity<?> getBlogById(@PathVariable Long blogId) {
        try {
            Optional<Blog> blog = blogRepository.findById(blogId);
            if (blog.isPresent()) {
                Blog blogEntity = blog.get();
                
                // 발행된 블로그만 조회 가능
                if (blogEntity.getIsPublished() == 1) {
                    // 조회수 증가
                    blogEntity.setViewCount(blogEntity.getViewCount() + 1);
                    blogRepository.save(blogEntity);
                    
                    return ResponseEntity.ok(blogEntity);
                } else {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("Blog is not published"));
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 블로그 생성
    @PostMapping
    public ResponseEntity<?> createBlog(@Valid @RequestBody Blog blog) {
        try {
            // 사용자 정보 확인 (실제로는 인증된 사용자 정보를 사용해야 함)
            if (blog.getUser() == null || blog.getUser().getUserId() == null) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("User information is required"));
            }
            
            Optional<User> user = userRepository.findById(blog.getUser().getUserId());
            if (!user.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("User not found"));
            }
            
            blog.setUser(user.get());
            blog.setCreateDate(LocalDateTime.now());
            blog.setUpdateDate(LocalDateTime.now());
            
            Blog savedBlog = blogRepository.save(blog);
            return ResponseEntity.ok(savedBlog);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 블로그 수정
    @PutMapping("/{blogId}")
    public ResponseEntity<?> updateBlog(@PathVariable Long blogId, @Valid @RequestBody Blog blogDetails) {
        try {
            Optional<Blog> blog = blogRepository.findById(blogId);
            if (blog.isPresent()) {
                Blog blogEntity = blog.get();
                
                blogEntity.setTitle(blogDetails.getTitle());
                blogEntity.setContent(blogDetails.getContent());
                blogEntity.setSummary(blogDetails.getSummary());
                blogEntity.setIsPublished(blogDetails.getIsPublished());
                blogEntity.setIsFeatured(blogDetails.getIsFeatured());
                blogEntity.setUpdateDate(LocalDateTime.now());
                
                // 발행 상태가 변경되면 발행일자 설정
                if (blogDetails.getIsPublished() == 1 && blogEntity.getPublishDate() == null) {
                    blogEntity.setPublishDate(LocalDateTime.now());
                }
                
                Blog updatedBlog = blogRepository.save(blogEntity);
                return ResponseEntity.ok(updatedBlog);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 블로그 삭제
    @DeleteMapping("/{blogId}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long blogId) {
        try {
            if (blogRepository.existsById(blogId)) {
                blogRepository.deleteById(blogId);
                return ResponseEntity.ok(createSuccessResponse("Blog deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 추천 블로그 조회
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedBlogs() {
        try {
            List<Blog> featuredBlogs = blogRepository.findByIsFeaturedAndIsPublished(1, 1);
            return ResponseEntity.ok(featuredBlogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 인기 블로그 조회 (조회수 순)
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularBlogs() {
        try {
            List<Blog> popularBlogs = blogRepository.findPublishedBlogsOrderByViewCount();
            return ResponseEntity.ok(popularBlogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    // 최신 블로그 조회
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentBlogs() {
        try {
            List<Blog> recentBlogs = blogRepository.findPublishedBlogsOrderByPublishDate();
            return ResponseEntity.ok(recentBlogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Error: " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
    
    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}
