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
import org.springframework.web.bind.annotation.CrossOrigin;
@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
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
        return ResponseEntity.ok(recipeService.createRecipe(recipe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @Valid @RequestBody Recipe recipeDetails, @AuthenticationPrincipal User user) {
        Optional<Recipe> recipeOpt = recipeService.getRecipeById(id);
        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();
            if (!recipe.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            recipe.setTitle(recipeDetails.getTitle());
            recipe.setDescription(recipeDetails.getDescription());
            recipe.setIngredients(recipeDetails.getIngredients());
            recipe.setInstructions(recipeDetails.getInstructions());
            recipe.setCategory(recipeDetails.getCategory());
            recipe.setImageUrl(recipeDetails.getImageUrl());
            recipe.setVideoUrl(recipeDetails.getVideoUrl());
            return ResponseEntity.ok(recipeService.updateRecipe(recipe));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Optional<Recipe> recipeOpt = recipeService.getRecipeById(id);
        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();
            if (!recipe.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }
            recipeService.deleteRecipe(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Recipe>> getTopRatedRecipes() {
        return ResponseEntity.ok(recipeService.getTopRatedRecipes());
    }
}
