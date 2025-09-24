package com.example.aqualink.service;

import com.example.aqualink.entity.*;
import com.example.aqualink.dto.BlogPostDto;
import com.example.aqualink.dto.BlogCommentDto;
import com.example.aqualink.dto.BlogReactionDto;
import com.example.aqualink.dto.UserSummaryDto;
import com.example.aqualink.exception.ResourceNotFoundException;
import com.example.aqualink.repository.BlogCommentRepository;
import com.example.aqualink.repository.BlogPostRepository;
import com.example.aqualink.repository.BlogReactionRepository;
import com.example.aqualink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BlogService {

    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);
    
    private final BlogPostRepository blogPostRepository;
    private final BlogCommentRepository blogCommentRepository;
    private final BlogReactionRepository blogReactionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public BlogService(BlogPostRepository blogPostRepository, 
                      BlogCommentRepository blogCommentRepository,
                      BlogReactionRepository blogReactionRepository,
                      UserRepository userRepository,
                      FileStorageService fileStorageService) {
        this.blogPostRepository = blogPostRepository;
        this.blogCommentRepository = blogCommentRepository;
        this.blogReactionRepository = blogReactionRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    // Blog Post Methods
    public Page<BlogPost> getAllPublishedPosts(Pageable pageable) {
        return blogPostRepository.findByPublishedTrue(pageable);
    }

    public Page<BlogPost> getPostsByAuthor(User author, Pageable pageable) {
        return blogPostRepository.findByAuthor(author, pageable);
    }

    public Page<BlogPost> getPostsByAuthorAndPublished(User author, Pageable pageable) {
        return blogPostRepository.findByAuthorAndPublishedTrue(author, pageable);
    }

    public BlogPost getPostById(Long postId) {
        return blogPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + postId));
    }

    @Transactional
    public BlogPost createBlogPost(BlogPost blogPost, User author) {
        blogPost.setAuthor(author);
        return blogPostRepository.save(blogPost);
    }

    @Transactional
    public BlogPost updateBlogPost(Long postId, BlogPost updatedPost, User currentUser) {
        BlogPost existingPost = getPostById(postId);
        
        // Check if the current user is the author
        if (!existingPost.getAuthor().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You are not authorized to update this blog post");
        }
        
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setSummary(updatedPost.getSummary());
        
        // Only update featuredImagePath if a new one is provided
        if (updatedPost.getFeaturedImagePath() != null && !updatedPost.getFeaturedImagePath().isEmpty()) {
            existingPost.setFeaturedImagePath(updatedPost.getFeaturedImagePath());
        }
        
        // Handle published status change
        if (updatedPost.isPublished() && !existingPost.isPublished()) {
            existingPost.setPublished(true);
            existingPost.setPublishedAt(LocalDateTime.now());
        } else if (!updatedPost.isPublished() && existingPost.isPublished()) {
            existingPost.setPublished(false);
        }
        
        return blogPostRepository.save(existingPost);
    }

    @Transactional
    public void deleteBlogPost(Long postId, User currentUser) {
        BlogPost post = getPostById(postId);
        
        // Check if the current user is the author
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You are not authorized to delete this blog post");
        }
        
        // Delete any associated images
        if (post.getFeaturedImagePath() != null && !post.getFeaturedImagePath().isEmpty()) {
            try {
                fileStorageService.deleteFile(post.getFeaturedImagePath());
            } catch (IOException e) {
                logger.error("Failed to delete featured image file: {}", post.getFeaturedImagePath(), e);
                // Continue with deletion as the database record should still be removed
            }
        }
        
        blogPostRepository.delete(post);
    }

    // Blog Comment Methods
    public Page<BlogComment> getCommentsByPost(BlogPost blogPost, Pageable pageable) {
        return blogCommentRepository.findByBlogPost(blogPost, pageable);
    }

    public Page<BlogComment> getPendingComments(Pageable pageable) {
        return blogCommentRepository.findByApprovedFalse(pageable);
    }

    @Transactional
    public BlogComment addComment(BlogPost blogPost, String content, User user) {
        BlogComment comment = new BlogComment();
        comment.setBlogPost(blogPost);
        comment.setUser(user);
        comment.setContent(content);
        
        // Auto-approve comments from post author or admins
        if (user.getId().equals(blogPost.getAuthor().getId()) || user.getRoles().contains(Role.ADMIN)) {
            comment.setApproved(true);
        }
        
        return blogCommentRepository.save(comment);
    }

    @Transactional
    public BlogComment approveComment(Long commentId) {
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        comment.setApproved(true);
        return blogCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Check if current user is the comment author, post author, or admin
        boolean isAuthorized = comment.getUser().getId().equals(currentUser.getId()) || 
                              comment.getBlogPost().getAuthor().getId().equals(currentUser.getId()) ||
                              currentUser.getRoles().contains(Role.ADMIN);
        
        if (!isAuthorized) {
            throw new IllegalStateException("You are not authorized to delete this comment");
        }
        
        blogCommentRepository.delete(comment);
    }

    // Blog Reaction Methods
    @Transactional
    public BlogReaction addOrUpdateReaction(BlogPost blogPost, User user, ReactionType type) {
        Optional<BlogReaction> existingReaction = blogReactionRepository.findByBlogPostAndUser(blogPost, user);
        
        if (existingReaction.isPresent()) {
            BlogReaction reaction = existingReaction.get();
            
            // If same type, remove the reaction
            if (reaction.getType() == type) {
                blogReactionRepository.delete(reaction);
                return null;
            } else {
                // Change the reaction type
                reaction.setType(type);
                return blogReactionRepository.save(reaction);
            }
        } else {
            // Create new reaction
            BlogReaction reaction = new BlogReaction();
            reaction.setBlogPost(blogPost);
            reaction.setUser(user);
            reaction.setType(type);
            return blogReactionRepository.save(reaction);
        }
    }

    public Optional<ReactionType> getUserReaction(BlogPost blogPost, User user) {
        return blogReactionRepository.findReactionType(blogPost, user);
    }

    public long getLikesCount(BlogPost blogPost) {
        return blogReactionRepository.countByBlogPostAndType(blogPost, ReactionType.LIKE);
    }

    public long getDislikesCount(BlogPost blogPost) {
        return blogReactionRepository.countByBlogPostAndType(blogPost, ReactionType.DISLIKE);
    }
    
    // DTO conversion methods
    public List<BlogPostDto> getAllBlogPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPosts = blogPostRepository.findAll(pageable);
        return blogPosts.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<BlogPostDto> getBlogPosts(Boolean published, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPosts;
        if (published) {
            blogPosts = getAllPublishedPosts(pageable);
        } else {
            blogPosts = blogPostRepository.findByPublishedFalse(pageable);
        }
        return blogPosts.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public BlogPostDto getBlogPostById(Long id) {
        BlogPost blogPost = getPostById(id);
        return convertToDto(blogPost);
    }
    
    public List<BlogPostDto> getBlogPostsByUser(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> blogPosts = getPostsByAuthor(user, pageable);
        return blogPosts.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private BlogPostDto convertToDto(BlogPost blogPost) {
        BlogPostDto dto = new BlogPostDto();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setContent(blogPost.getContent());
        dto.setSummary(blogPost.getSummary());
        dto.setFeaturedImagePath(blogPost.getFeaturedImagePath());
        dto.setPublished(blogPost.isPublished());
        dto.setCreatedAt(blogPost.getCreatedAt());
        dto.setUpdatedAt(blogPost.getUpdatedAt());
        dto.setPublishedAt(blogPost.getPublishedAt());
        
        if (blogPost.getAuthor() != null) {
            UserSummaryDto authorDto = new UserSummaryDto();
            authorDto.setId(blogPost.getAuthor().getId());
            authorDto.setName(blogPost.getAuthor().getName());
            authorDto.setEmail(blogPost.getAuthor().getEmail());
            // Logo URL not available in User entity, leave it null
            dto.setAuthor(authorDto);
        }
        
        // Set counts
        dto.setCommentsCount(blogCommentRepository.countByBlogPostAndApprovedTrue(blogPost));
        dto.setLikesCount(getLikesCount(blogPost));
        dto.setDislikesCount(getDislikesCount(blogPost));
        
        return dto;
    }
    
    // Controller-friendly wrapper methods that handle DTOs and string usernames
    
    public BlogPostDto createBlogPost(BlogPostDto blogPostDto, List<MultipartFile> images, String username) {
        User user = getUserByUsername(username);
        // Convert DTO to entity
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(blogPostDto.getTitle());
        blogPost.setContent(blogPostDto.getContent());
        blogPost.setSummary(blogPostDto.getSummary());
        blogPost.setPublished(blogPostDto.isPublished());
        
        // Handle image upload if provided
        if (images != null && !images.isEmpty()) {
            // Assuming first image is featured image
            try {
                String featuredImagePath = fileStorageService.storeFile(images.get(0), "blog");
                blogPost.setFeaturedImagePath(featuredImagePath);
            } catch (IOException e) {
                logger.error("Failed to store featured image", e);
                // Continue without setting the image path
            }
        }
        
        BlogPost savedPost = createBlogPost(blogPost, user);
        return convertToDto(savedPost);
    }
    
    public BlogPostDto updateBlogPost(Long id, BlogPostDto blogPostDto, List<MultipartFile> newImages, String username) {
        User user = getUserByUsername(username);
        // Convert DTO to entity
        BlogPost updatedPost = new BlogPost();
        updatedPost.setTitle(blogPostDto.getTitle());
        updatedPost.setContent(blogPostDto.getContent());
        updatedPost.setSummary(blogPostDto.getSummary());
        updatedPost.setPublished(blogPostDto.isPublished());
        
        // Handle new images if provided
        if (newImages != null && !newImages.isEmpty()) {
            try {
                String featuredImagePath = fileStorageService.storeFile(newImages.get(0), "blog");
                updatedPost.setFeaturedImagePath(featuredImagePath);
            } catch (IOException e) {
                logger.error("Failed to store new featured image", e);
                // Continue without setting the image path
            }
        }
        
        BlogPost savedPost = updateBlogPost(id, updatedPost, user);
        return convertToDto(savedPost);
    }
    
    public void deleteBlogPost(Long postId, String username) {
        User user = getUserByUsername(username);
        deleteBlogPost(postId, user);
    }
    
    public BlogPostDto publishBlogPost(Long postId, String username) {
        User user = getUserByUsername(username);
        BlogPost post = getPostById(postId);
        
        // Check if the current user is the author
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to publish this blog post");
        }
        
        post.setPublished(true);
        post.setPublishedAt(LocalDateTime.now());
        BlogPost savedPost = blogPostRepository.save(post);
        return convertToDto(savedPost);
    }
    
    public BlogPostDto unpublishBlogPost(Long postId, String username) {
        User user = getUserByUsername(username);
        BlogPost post = getPostById(postId);
        
        // Check if the current user is the author
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to unpublish this blog post");
        }
        
        post.setPublished(false);
        post.setPublishedAt(null);
        BlogPost savedPost = blogPostRepository.save(post);
        return convertToDto(savedPost);
    }
    
    public List<BlogCommentDto> getCommentsForBlog(Long blogId, int page, int size) {
        BlogPost blogPost = getPostById(blogId);
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogComment> comments = getCommentsByPost(blogPost, pageable);
        return comments.getContent().stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
    }
    
    public BlogCommentDto addComment(Long blogId, BlogCommentDto commentDto, String username) {
        User user = getUserByUsername(username);
        BlogPost blogPost = getPostById(blogId);
        BlogComment comment = addComment(blogPost, commentDto.getContent(), user);
        return convertCommentToDto(comment);
    }
    
    public BlogCommentDto updateComment(Long commentId, BlogCommentDto commentDto, String username) {
        User user = getUserByUsername(username);
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Check if the current user is the author of the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to update this comment");
        }
        
        comment.setContent(commentDto.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        BlogComment savedComment = blogCommentRepository.save(comment);
        return convertCommentToDto(savedComment);
    }
    
    public void deleteComment(Long commentId, String username) {
        User user = getUserByUsername(username);
        BlogComment comment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        
        // Check if the current user is the author of the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("You are not authorized to delete this comment");
        }
        
        blogCommentRepository.delete(comment);
    }
    
    public BlogCommentDto approveComment(Long commentId, String username) {
        BlogComment comment = approveComment(commentId);
        return convertCommentToDto(comment);
    }
    
    public BlogReactionDto addReaction(Long blogId, ReactionType reactionType, String username) {
        User user = getUserByUsername(username);
        BlogPost blogPost = getPostById(blogId);
        BlogReaction reaction = addOrUpdateReaction(blogPost, user, reactionType);
        return convertReactionToDto(reaction);
    }
    
    public void removeReaction(Long blogId, String username) {
        User user = getUserByUsername(username);
        BlogPost blogPost = getPostById(blogId);
        Optional<BlogReaction> reaction = blogReactionRepository.findByBlogPostAndUser(blogPost, user);
        reaction.ifPresent(blogReactionRepository::delete);
    }
    
    public List<BlogReactionDto> getReactionsForBlog(Long blogId, ReactionType type, int page, int size) {
        BlogPost blogPost = getPostById(blogId);
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogReaction> reactions;
        
        if (type != null) {
            reactions = blogReactionRepository.findByBlogPostAndType(blogPost, type, pageable);
        } else {
            reactions = blogReactionRepository.findByBlogPost(blogPost, pageable);
        }
        
        return reactions.getContent().stream()
                .map(this::convertReactionToDto)
                .collect(Collectors.toList());
    }
    
    private User getUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));
    }
    
    private BlogCommentDto convertCommentToDto(BlogComment comment) {
        BlogCommentDto dto = new BlogCommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setApproved(comment.isApproved());
        
        if (comment.getUser() != null) {
            UserSummaryDto userDto = new UserSummaryDto();
            userDto.setId(comment.getUser().getId());
            userDto.setName(comment.getUser().getName());
            userDto.setEmail(comment.getUser().getEmail());
            dto.setUser(userDto);
        }
        
        return dto;
    }
    
    private BlogReactionDto convertReactionToDto(BlogReaction reaction) {
        BlogReactionDto dto = new BlogReactionDto();
        dto.setId(reaction.getId());
        dto.setReactionType(reaction.getType().toString());
        dto.setCreatedAt(reaction.getCreatedAt());
        
        if (reaction.getUser() != null) {
            UserSummaryDto userDto = new UserSummaryDto();
            userDto.setId(reaction.getUser().getId());
            userDto.setName(reaction.getUser().getName());
            userDto.setEmail(reaction.getUser().getEmail());
            dto.setUser(userDto);
        }
        
        return dto;
    }
}