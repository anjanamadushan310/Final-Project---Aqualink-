package com.example.aqualink.controller;

import com.example.aqualink.dto.BlogCommentDto;
import com.example.aqualink.dto.BlogPostDto;
import com.example.aqualink.dto.BlogReactionDto;
import com.example.aqualink.entity.ReactionType;
import com.example.aqualink.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    // Blog Post endpoints
    
    @GetMapping
    public ResponseEntity<List<BlogPostDto>> getAllBlogPosts(
            @RequestParam(required = false) Boolean published,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<BlogPostDto> posts;
        if (published != null) {
            posts = blogService.getBlogPosts(published, page, size);
        } else {
            posts = blogService.getAllBlogPosts(page, size);
        }
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogPostById(id));
    }

    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<BlogPostDto>> getBlogPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getBlogPostsByUser(userId, page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<BlogPostDto> createBlogPost(
            @RequestPart("blogPost") BlogPostDto blogPostDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.createBlogPost(blogPostDto, images, principal.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<BlogPostDto> updateBlogPost(
            @PathVariable Long id,
            @RequestPart("blogPost") BlogPostDto blogPostDto,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages,
            Principal principal) {
        return ResponseEntity.ok(blogService.updateBlogPost(id, blogPostDto, newImages, principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<Void> deleteBlogPost(@PathVariable Long id, Principal principal) {
        blogService.deleteBlogPost(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<BlogPostDto> publishBlogPost(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(blogService.publishBlogPost(id, principal.getName()));
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<BlogPostDto> unpublishBlogPost(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(blogService.unpublishBlogPost(id, principal.getName()));
    }

    // Comment endpoints

    @GetMapping("/{blogId}/comments")
    public ResponseEntity<List<BlogCommentDto>> getCommentsForBlog(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getCommentsForBlog(blogId, page, size));
    }

    @PostMapping("/{blogId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogCommentDto> addComment(
            @PathVariable Long blogId,
            @RequestBody BlogCommentDto commentDto,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.addComment(blogId, commentDto, principal.getName()));
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogCommentDto> updateComment(
            @PathVariable Long commentId,
            @RequestBody BlogCommentDto commentDto,
            Principal principal) {
        return ResponseEntity.ok(blogService.updateComment(commentId, commentDto, principal.getName()));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Principal principal) {
        blogService.deleteComment(commentId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/comments/{commentId}/approve")
    @PreAuthorize("hasRole('EXPORTER')")
    public ResponseEntity<BlogCommentDto> approveComment(
            @PathVariable Long commentId, 
            Principal principal) {
        return ResponseEntity.ok(blogService.approveComment(commentId, principal.getName()));
    }

    // Reaction endpoints

    @PostMapping("/{blogId}/react")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BlogReactionDto> reactToBlogPost(
            @PathVariable Long blogId,
            @RequestParam ReactionType reactionType,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blogService.addReaction(blogId, reactionType, principal.getName()));
    }

    @DeleteMapping("/{blogId}/reactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeReaction(@PathVariable Long blogId, Principal principal) {
        blogService.removeReaction(blogId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{blogId}/reactions")
    public ResponseEntity<List<BlogReactionDto>> getReactionsForBlog(
            @PathVariable Long blogId,
            @RequestParam(required = false) ReactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getReactionsForBlog(blogId, type, page, size));
    }
}