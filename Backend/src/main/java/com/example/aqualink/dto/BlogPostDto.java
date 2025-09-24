package com.example.aqualink.dto;

import com.example.aqualink.entity.ReactionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogPostDto {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String featuredImagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private boolean published;
    private UserSummaryDto author;
    private long commentsCount;
    private long likesCount;
    private long dislikesCount;
    private ReactionType userReaction; // The current user's reaction, if any
    private List<BlogCommentDto> comments; // Included when fetching a single post
}