package com.thehfpv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads/images/";

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 파일 유효성 검사
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이미지 파일 타입 검사
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "Only image files can be uploaded.");
                return ResponseEntity.badRequest().body(response);
            }

            // 업로드 디렉토리 생성
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // 파일 저장
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath);

            // 응답 URL 생성 (프론트엔드에서 접근 가능한 절대 URL)
            String imageUrl = "http://localhost:8080/uploads/images/" + filename;

            response.put("success", true);
            response.put("url", imageUrl);
            response.put("filename", filename);
            response.put("location", imageUrl); // TinyMCE가 요구하는 필드

            System.out.println("Image upload success: " + filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("Image upload failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "An error occurred during file upload.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
