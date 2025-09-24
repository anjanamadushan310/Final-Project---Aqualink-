package com.example.aqualink.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogReactionDto {
    private Long id;
    private String reactionType; // LIKE, DISLIKE
    private LocalDateTime createdAt;
    private UserSummaryDto user;
    private Long blogPostId;
}