package com.example.aqualink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 500)
    private String summary;

    @Column(name = "featured_image_path")
    private String featuredImagePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(nullable = false)
    private boolean published = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BlogReaction> reactions = new HashSet<>();

    // Utility methods to calculate like/dislike counts
    public long getLikesCount() {
        return reactions.stream().filter(reaction -> reaction.getType() == ReactionType.LIKE).count();
    }

    public long getDislikesCount() {
        return reactions.stream().filter(reaction -> reaction.getType() == ReactionType.DISLIKE).count();
    }

    // Helper methods for bi-directional relationships
    public void addComment(BlogComment comment) {
        comments.add(comment);
        comment.setBlogPost(this);
    }

    public void removeComment(BlogComment comment) {
        comments.remove(comment);
        comment.setBlogPost(null);
    }

    public void addReaction(BlogReaction reaction) {
        reactions.add(reaction);
        reaction.setBlogPost(this);
    }

    public void removeReaction(BlogReaction reaction) {
        reactions.remove(reaction);
        reaction.setBlogPost(null);
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}