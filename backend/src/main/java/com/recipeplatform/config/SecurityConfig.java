package com.recipeplatform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Use stateless sessions
            )
            .authorizeHttpRequests(auth -> auth
                // Allow anyone to register or log in
                .requestMatchers("/api/auth/**").permitAll() 
                
                // Allow anyone to VIEW (GET) recipes and related content
                .requestMatchers(HttpMethod.GET, "/api/recipes/**").permitAll()
                
                // Only COOK or ADMIN can create (POST) recipes
                .requestMatchers(HttpMethod.POST, "/api/recipes").hasAnyRole("COOK", "ADMIN")

                // Only ADMIN can access the user management endpoints
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                
                // All other requests (like POST/PUT/DELETE) must be authenticated
                .anyRequest().authenticated() 
            )
            // Add our custom JWT filter before the standard authentication filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // Expose the AuthenticationManager as a Bean for our AuthController
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    // Remember: Your PasswordEncoder bean is correctly placed in your main App.java class
}

