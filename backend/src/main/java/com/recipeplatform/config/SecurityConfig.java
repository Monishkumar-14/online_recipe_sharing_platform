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

    // REMOVE THIS FIELD INJECTION
    // @Autowired
    // private JwtAuthFilter jwtAuthFilter; 

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Allow anyone to register or log in
                .requestMatchers("/api/auth/**").permitAll() 
                
                // Allow anyone to VIEW (GET) recipes
                .requestMatchers(HttpMethod.GET, "/api/recipes/**").permitAll()
                
                // --- ADD THIS RULE ---
                // Only COOK or ADMIN can create (POST) recipes
                .requestMatchers(HttpMethod.POST, "/api/recipes").hasAnyRole("COOK", "ADMIN")
                
                // All other requests must be authenticated
                .anyRequest().authenticated() 
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    // Your PasswordEncoder bean should be in your main App.java class
}