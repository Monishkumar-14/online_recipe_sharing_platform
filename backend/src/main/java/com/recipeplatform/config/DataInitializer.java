package com.recipeplatform.config;

import com.recipeplatform.model.User;
import com.recipeplatform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if the admin user already exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            
            log.info("Creating default ADMIN user...");

            // Create a new admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("1234"));
            adminUser.setEmail("admin@recipe.com"); // Placeholder email
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setCreatedAt(LocalDateTime.now());

            // Save the new admin user to the database
            userRepository.save(adminUser);
            
            log.info("Default ADMIN user created successfully (username: admin, password: 1234)");
        } else {
            log.info("Admin user 'admin' already exists. Skipping creation.");
        }
    }
}
