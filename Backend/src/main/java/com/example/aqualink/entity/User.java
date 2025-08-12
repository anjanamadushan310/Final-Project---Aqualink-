package com.example.aqualink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "NIC number is required")
    @Pattern(regexp = "^([0-9]{9}[vVxX]|[0-9]{12})$", message = "Invalid NIC format")
    private String nicNumber;

    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    private String name;

    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    private String password;

    private String nicDocumentPath;

    // Changed back to LAZY to avoid ConcurrentModificationException
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserRole> userRoles = new HashSet<>();

    @Column(nullable = false, columnDefinition = "BIT DEFAULT 1")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Safe getRoles() method that won't cause concurrent modification
    public Set<Role> getRoles() {
        if (userRoles == null) {
            return new HashSet<>();
        }

        // Force initialization of the collection safely
        try {
            return userRoles.stream()
                    .filter(userRole -> userRole != null && userRole.getRoleName() != null)
                    .map(UserRole::getRoleName)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            System.out.println("Error accessing user roles: " + e.getMessage());
            return new HashSet<>();
        }
    }

    // Override equals and hashCode to avoid Lombok issues with JPA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nicNumber='" + nicNumber + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                '}';
    }
}