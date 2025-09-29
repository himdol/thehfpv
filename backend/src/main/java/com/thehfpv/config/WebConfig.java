package com.thehfpv.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지 파일을 서빙하기 위한 설정
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:uploads/images/");
    }
}
