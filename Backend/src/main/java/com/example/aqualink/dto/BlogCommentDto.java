package com.example.aqualink.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogCommentDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean approved;
    private UserSummaryDto user;
    private Long blogPostId;
}