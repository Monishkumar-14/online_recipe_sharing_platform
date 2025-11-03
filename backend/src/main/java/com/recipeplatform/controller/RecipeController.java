package com.recipeplatform.controller;

import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus; // <-- IMPORT
import com.recipeplatform.dto.RecipeDto; // <-- ADD THIS
@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/feed")
    public ResponseEntity<List<RecipeDto>> getMyFeed(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recipeService.getFeedForUser(user));
    }
    
    @GetMapping
    public ResponseEntity<List<RecipeDto>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        return recipe.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Recipe>> getRecipesByCategory(@PathVariable Recipe.Category category) {
        return ResponseEntity.ok(recipeService.getRecipesByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipes(@RequestParam String keyword) {
        return ResponseEntity.ok(recipeService.searchRecipes(keyword));
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@Valid @RequestBody Recipe recipe, @AuthenticationPrincipal User user) {
        recipe.setUser(user);
        Recipe createdRecipe = recipeService.createRecipe(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRecipe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, 
                                               @Valid @RequestBody Recipe recipeDetails, 
                                               @AuthenticationPrincipal User user) {
        
        Recipe recipeToUpdate = recipeService.getRecipeById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // Security Check: Allow if user is author OR user is ADMIN
        if (!recipeToUpdate.getUser().getId().equals(user.getId()) &&
            !user.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Update fields
        recipeToUpdate.setTitle(recipeDetails.getTitle());
        recipeToUpdate.setDescription(recipeDetails.getDescription());
        recipeToUpdate.setIngredients(recipeDetails.getIngredients());
        recipeToUpdate.setInstructions(recipeDetails.getInstructions());
        recipeToUpdate.setCategory(recipeDetails.getCategory());
        recipeToUpdate.setImageUrl(recipeDetails.getImageUrl());
        recipeToUpdate.setVideoUrl(recipeDetails.getVideoUrl());
        
        Recipe updatedRecipe = recipeService.updateRecipe(recipeToUpdate);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, 
                                             @AuthenticationPrincipal User user) {
        
        Recipe recipeToDelete = recipeService.getRecipeById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        // Security Check: Allow if user is author OR user is ADMIN
        if (!recipeToDelete.getUser().getId().equals(user.getId()) &&
            !user.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Recipe>> getTopRatedRecipes() {
        return ResponseEntity.ok(recipeService.getTopRatedRecipes());
    }
}
