package com.recipeplatform.controller;

import com.recipeplatform.model.User;
import com.recipeplatform.dto.RecipeDto;
import com.recipeplatform.service.RecipeService;
import com.recipeplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RecipeService recipeService;

    /**
     * Get all users. Secured by SecurityConfig to be ADMIN only.
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Get a single user's details by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * Get all recipes for a specific user ID.
     */
    @GetMapping("/{id}/recipes")
    public ResponseEntity<List<RecipeDto>> getUserRecipes(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipesByUserId(id));
    }

    
    /**
     * Delete a user. Secured by SecurityConfig to be ADMIN only.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User adminUser) {
        try {
            userService.deleteUser(id, adminUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // This will catch the "cannot delete self" error
            return ResponseEntity.badRequest().build();
        }
    }
}