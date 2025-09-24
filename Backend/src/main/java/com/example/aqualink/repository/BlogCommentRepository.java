package com.example.aqualink.repository;

import com.example.aqualink.entity.BlogComment;
import com.example.aqualink.entity.BlogPost;
import com.example.aqualink.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {
    
    List<BlogComment> findByBlogPostAndApprovedTrue(BlogPost blogPost);
    
    Page<BlogComment> findByBlogPost(BlogPost blogPost, Pageable pageable);
    
    Page<BlogComment> findByUser(User user, Pageable pageable);
    
    Page<BlogComment> findByApprovedFalse(Pageable pageable);
    
    long countByBlogPostAndApprovedTrue(BlogPost blogPost);
    
    long countByApprovedFalse();
}