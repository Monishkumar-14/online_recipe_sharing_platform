package com.recipeplatform.service;

import com.recipeplatform.dto.RecipeDto;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.FollowRepository;
import com.recipeplatform.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private FollowRepository followRepository;

    public Recipe createRecipe(Recipe recipe) {
        // Ensure timestamps are set on creation
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    /**
     * Gets all recipes for the "Discover" feed.
     */
    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAllRecipeCardData();
    }

    /**
     * Gets a single, full Recipe object (for Recipe Detail page).
     */
    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public List<Recipe> getRecipesByCategory(Recipe.Category category) {
        return recipeRepository.findByCategory(category);
    }

    /**
     * Gets all recipes for the currently logged-in user (for Profile page).
     */
    public List<RecipeDto> getMyRecipes(User user) {
        return recipeRepository.findMyRecipes(user.getId());
    }
    
    /**
     * Gets all recipes for a specific user ID (for Admin Dashboard).
     */
    public List<RecipeDto> getRecipesByUserId(Long userId) {
        return recipeRepository.findMyRecipes(userId);
    }

    public List<Recipe> searchRecipes(String keyword) {
        return recipeRepository.searchByKeyword(keyword);
    }

    public Recipe updateRecipe(Recipe recipe) {
        // Ensure update timestamp is set
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    public List<Recipe> getTopRatedRecipes() {
        return recipeRepository.getTopRatedRecipes();
    }

    /**
     * Gets all recipes from users the current user follows (for "Following" feed).
     */
    public List<RecipeDto> getFeedForUser(User user) {
        // 1. Find all IDs the user follows
        List<Long> followingIds = followRepository.findFollowingIdsByFollowerId(user.getId());

        // 2. If they follow no one, return an empty list
        if (followingIds.isEmpty()) {
            return new ArrayList<>();
        }

        // 3. Fetch recipes from those IDs
        return recipeRepository.findRecipesByFollowing(followingIds);
    }
}