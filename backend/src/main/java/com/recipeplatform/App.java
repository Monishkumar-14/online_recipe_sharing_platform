package com.recipeplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // Import this
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import this
import org.springframework.security.crypto.password.PasswordEncoder; // Import this

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    // Add this method here
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}