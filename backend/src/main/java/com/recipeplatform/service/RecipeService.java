package com.recipeplatform.service;

import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.recipeplatform.dto.RecipeDto;
import com.recipeplatform.model.User;
@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAllRecipeCardData();
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public List<Recipe> getRecipesByCategory(Recipe.Category category) {
        return recipeRepository.findByCategory(category);
    }

    public List<Recipe> getRecipesByUser(User user) {
        return recipeRepository.findByUserId(user.getId());
    }

    public List<Recipe> searchRecipes(String keyword) {
        return recipeRepository.searchByKeyword(keyword);
    }

    public Recipe updateRecipe(Recipe recipe) {
        recipe.setUpdatedAt(java.time.LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    public List<Recipe> getTopRatedRecipes() {
        return recipeRepository.findAllOrderByAverageRatingDesc();
    }

    public List<RecipeDto> getMyRecipes(User user) {
        return recipeRepository.findMyRecipes(user.getId());
    }
}
