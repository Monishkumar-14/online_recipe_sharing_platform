package com.recipeplatform.service;

import com.recipeplatform.model.Rating;
import com.recipeplatform.model.RatingRequest;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.RatingRepository;
import com.recipeplatform.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    public Rating submitRating(Long recipeId, User user, RatingRequest ratingRequest) {
        // Find if the user already rated this recipe
        Optional<Rating> existingRating = ratingRepository.findByRecipeIdAndUserId(recipeId, user.getId());
        
        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
        } else {
            // Create a new rating
            rating = new Rating();
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new RuntimeException("Recipe not found"));
            rating.setRecipe(recipe);
            rating.setUser(user);
        }
        
        rating.setScore(ratingRequest.score());
        return ratingRepository.save(rating);
    }

    public Map<String, Double> getAverageRating(Long recipeId) {
        Double avg = ratingRepository.getAverageRatingByRecipeId(recipeId);
        // Handle cases where there are no ratings yet
        if (avg == null) {
            avg = 0.0;
        }
        return Map.of("averageRating", avg);
    }
}