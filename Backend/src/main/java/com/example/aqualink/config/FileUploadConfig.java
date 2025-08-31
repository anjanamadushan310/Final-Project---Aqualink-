package com.example.aqualink.config;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("./Uploads/")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Create upload directory if it doesn't exist
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        // Handle main upload directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir);
                
        // Specifically handle banner uploads
        File bannerDirectory = new File("uploads/banners/");
        if (!bannerDirectory.exists()) {
            bannerDirectory.mkdirs();
        }
        
        registry.addResourceHandler("/uploads/banners/**")
                .addResourceLocations("file:uploads/banners/");
    }

}