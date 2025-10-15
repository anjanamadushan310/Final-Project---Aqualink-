package com.example.aqualink.security.config;

import com.example.aqualink.security.filter.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // Allow all uploads paths - this is crucial for banner images, blog images, etc.
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers("/uploads/blog/**").permitAll()
                        .requestMatchers("/uploads/banners/**").permitAll()
                        .requestMatchers("/uploads/fish_images/**").permitAll()
                        .requestMatchers("/uploads/industrial_images/**").permitAll()
                        .requestMatchers("/uploads/profile-images/**").permitAll()
                        .requestMatchers("/uploads/service_images/**").permitAll()
                        // Allow API endpoints
                        .requestMatchers("/api/auth/**","/api/users/**", "/api/banners/**", "/api/v1/fish/**","/api/fish/**","/api/profile/**","/api/industrial-ads/**","/api/industrial/**","/api/v1/industrial/**","/api/services/**","/api/service-provider/services/**","/api/blogs/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/fish-ads").permitAll() // Allow POST for fish ads
                        .requestMatchers(HttpMethod.GET, "/api/fish-ads").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/delivery-quotes/create-initial-order").permitAll() // Temporarily allow this endpoint for testing
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Delivery and shop endpoints require authentication
                        .requestMatchers("/api/delivery/**").authenticated()
                        .requestMatchers("/api/delivery-quotes/**").authenticated()
                        .requestMatchers("/api/shop/**").authenticated()
                        // Cart endpoints require authentication
                        .requestMatchers("/api/cart/**").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}