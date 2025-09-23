package com.example.aqualink.security.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.example.aqualink.entity.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {
    private String secret = "O6z6I2xL8UeQ9nV0xD5hRpO3rYgCmJv6YzNcT0qLgBw=";
    private int jwtExpiration = 60*60*8*1000; // 8 hours for development

    // Add the missing getSigningKey method
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, Set<Role> roles, Long userId) {
        System.out.println("=== JWT TOKEN GENERATION DEBUG START ===");

        try {
            System.out.println("Input email: " + email);
            System.out.println("Input roles: " + roles);
            System.out.println("Roles size: " + (roles != null ? roles.size() : "NULL"));
            System.out.println("Input userId: " + userId);

            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email cannot be null or empty for token generation");
            }

            Map<String, Object> claims = new HashMap<>();

            // Convert roles to string list to avoid serialization issues
            if (roles != null && !roles.isEmpty()) {
                Set<String> roleNames = roles.stream()
                        .map(Role::name)
                        .collect(Collectors.toSet());
                claims.put("roles", roleNames);
                System.out.println("Adding roles to token: " + roleNames);
            } else {
                System.out.println("WARNING: No roles provided for token generation");
            }

            // Add userId to claims
            claims.put("userId", userId);

            System.out.println("Creating token with claims: " + claims);
            String token = createToken(claims, email);

            System.out.println("Token created successfully");
            System.out.println("Token length: " + (token != null ? token.length() : "NULL"));
            System.out.println("=== JWT TOKEN GENERATION DEBUG END - SUCCESS ===");

            return token;

        } catch (Exception e) {
            System.out.println("=== JWT TOKEN GENERATION DEBUG END - ERROR ===");
            System.out.println("Exception type: " + e.getClass().getSimpleName());
            System.out.println("Exception message: " + (e.getMessage() != null ? e.getMessage() : "NULL MESSAGE"));
            e.printStackTrace();
            throw new RuntimeException("Failed to generate token: " + e.getMessage(), e);
        }
    }

    private String createToken(Map<String, Object> claims, String subject) {
        try {
            System.out.println("Creating JWT with subject: " + subject);
            System.out.println("Claims: " + claims);

            Date issuedAt = new Date(System.currentTimeMillis());
            Date expiration = new Date(System.currentTimeMillis() + jwtExpiration);

            System.out.println("Token issued at: " + issuedAt);
            System.out.println("Token expires at: " + expiration);

            String token = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(issuedAt)
                    .setExpiration(expiration)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();

            System.out.println("JWT created successfully");
            return token;

        } catch (Exception e) {
            System.out.println("ERROR in createToken: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Boolean validateToken(String token, String email) {
        try {
            System.out.println("Validating token for email: " + email);
            final String tokenEmail = extractEmail(token);
            boolean isValid = (tokenEmail.equals(email) && !isTokenExpired(token));
            System.out.println("Token validation result: " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public String extractEmail(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            System.out.println("Failed to extract email from token: " + e.getMessage());
            throw e;
        }
    }

    public Long extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object userIdClaim = claims.get("userId");

            if (userIdClaim == null) {
                System.out.println("WARNING: No userId found in token");
                return null;
            }

            // Handle different number types that might be stored
            if (userIdClaim instanceof Integer) {
                return ((Integer) userIdClaim).longValue();
            } else if (userIdClaim instanceof Long) {
                return (Long) userIdClaim;
            } else if (userIdClaim instanceof String) {
                return Long.parseLong((String) userIdClaim);
            }

            System.out.println("Extracted userId: " + userIdClaim);
            return Long.valueOf(userIdClaim.toString());

        } catch (Exception e) {
            System.out.println("Failed to extract userId from token: " + e.getMessage());
            throw e;
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            // Updated to use modern JJWT API
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("Failed to parse JWT claims: " + e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
            System.out.println("Failed to check token expiration: " + e.getMessage());
            return true; // Consider expired if we can't check
        }
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }

    // Fixed getUserIdFromToken method using consistent approach
    public Long getUserIdFromToken(String token) {
        try {
            return extractUserId(token);
        } catch (Exception e) {
            System.out.println("Failed to get userId from token: " + e.getMessage());
            throw e;
        }
    }

    // Alternative method if you need roles from token
    public Set<String> extractRoles(String token) {
        try {
            Claims claims = extractAllClaims(token);
            @SuppressWarnings("unchecked")
            Set<String> roles = (Set<String>) claims.get("roles");
            return roles != null ? roles : Set.of();
        } catch (Exception e) {
            System.out.println("Failed to extract roles from token: " + e.getMessage());
            return Set.of();
        }
    }
}
