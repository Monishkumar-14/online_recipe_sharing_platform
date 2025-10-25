package com.recipeplatform.controller;

import com.recipeplatform.model.User;
import com.recipeplatform.model.LoginRequest;
import com.recipeplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication; // <-- IMPORT THIS
import org.springframework.security.core.context.SecurityContextHolder; // <-- IMPORT THIS
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.recipeplatform.config.JwtUtil; // <-- IMPORT
import org.springframework.security.core.userdetails.UserDetails; // <-- IMPORT
import org.springframework.security.core.userdetails.UserDetailsService; // <-- IMPORT

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // <-- ADD THIS LINE
public class AuthController {


    @Autowired
    private JwtUtil jwtUtil; // <-- INJECT

    @Autowired
    private UserDetailsService userDetailsService;


    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager; // <-- INJECT THIS

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", registeredUser.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Note: Login will be handled by Spring Security

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Load UserDetails to generate token
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.username());

            // Generate a REAL token
            final String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of("token", token)); // <-- Send real token
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }
}