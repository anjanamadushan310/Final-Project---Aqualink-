package com.example.aqualink.security.util;

import com.example.aqualink.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    private String secret = "O6z6I2xL8UeQ9nV0xD5hRpO3rYgCmJv6YzNcT0qLgBw=";
    private int jwtExpiration = 60*30; // 30 min

    public String generateToken(String email, Set<Role> roles) {
        System.out.println("=== JWT TOKEN GENERATION DEBUG START ===");

        try {
            System.out.println("Input email: " + email);
            System.out.println("Input roles: " + roles);
            System.out.println("Roles size: " + (roles != null ? roles.size() : "NULL"));

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
                    .signWith(SignatureAlgorithm.HS256, secret)
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

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
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
}