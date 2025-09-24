package com.example.aqualink.repository;

import com.example.aqualink.entity.BlogPost;
import com.example.aqualink.entity.BlogReaction;
import com.example.aqualink.entity.ReactionType;
import com.example.aqualink.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BlogReactionRepository extends JpaRepository<BlogReaction, Long> {
    
    Optional<BlogReaction> findByBlogPostAndUser(BlogPost blogPost, User user);
    
    Page<BlogReaction> findByBlogPost(BlogPost blogPost, Pageable pageable);
    
    Page<BlogReaction> findByBlogPostAndType(BlogPost blogPost, ReactionType type, Pageable pageable);
    
    long countByBlogPostAndType(BlogPost blogPost, ReactionType type);
    
    @Query("SELECT COUNT(r) FROM BlogReaction r WHERE r.blogPost = :blogPost AND r.type = :type")
    long countReactionsByType(@Param("blogPost") BlogPost blogPost, @Param("type") ReactionType type);
    
    @Query("SELECT r.type FROM BlogReaction r WHERE r.blogPost = :blogPost AND r.user = :user")
    Optional<ReactionType> findReactionType(@Param("blogPost") BlogPost blogPost, @Param("user") User user);
}