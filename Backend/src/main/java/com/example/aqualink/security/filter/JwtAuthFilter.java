/*package com.example.aqualink.security.filter;

import com.example.aqualink.entity.User;
import com.example.aqualink.security.service.AuthService;
import com.example.aqualink.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
            } catch (Exception e) {
                // Invalid token
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = authService.findByEmail(email);
            if (jwtUtil.validateToken(jwt, user.getEmail())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null,
                        user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())).toList()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}*/

package com.example.aqualink.security.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.aqualink.entity.User;
import com.example.aqualink.security.service.AuthService;
import com.example.aqualink.security.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        System.out.println("JWT Filter: Processing request to " + request.getRequestURI());
        
        // Skip JWT validation for public GET /api/fish endpoints
        String path = request.getRequestURI();
        if (request.getMethod().equals("GET") && (path.equals("/api/fish") || path.startsWith("/api/fish/"))) {
            System.out.println("JWT Filter: Skipping validation for public fish endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        System.out.println("JWT Filter: Authorization header = " + authHeader);
        
        String email = null;
        Long userId = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            System.out.println("JWT Filter: Extracted JWT token");
            try {
                email = jwtUtil.extractEmail(jwt);
                userId = jwtUtil.extractUserId(jwt);
                System.out.println("JWT Filter: Extracted email = " + email + ", userId = " + userId);
            } catch (Exception e) {
                System.out.println("JWT Filter: Error extracting token data: " + e.getMessage());
                // Invalid token
            }
        } else {
            System.out.println("JWT Filter: No valid Authorization header found");
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("JWT Filter: Attempting to authenticate user: " + email);
            User user = authService.findByEmail(email);
            if (user != null && jwtUtil.validateToken(jwt, user.getEmail())) {
                System.out.println("JWT Filter: Token validated successfully for user: " + email);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null,
                        user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())).toList()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                if (userId != null) {
                    request.setAttribute("userId", userId);
                    System.out.println("JWT Filter: Stored userId in request: " + userId);
                }
                System.out.println("JWT Filter: Authentication set successfully");
            } else {
                System.out.println("JWT Filter: Token validation failed for user: " + email);
            }
        } else {
            System.out.println("JWT Filter: Skipping authentication - email=" + email + ", existing auth=" + (SecurityContextHolder.getContext().getAuthentication() != null));
        }

        filterChain.doFilter(request, response);
    }
}
