package com.recipeplatform.service;

import com.recipeplatform.model.Rating;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    public Rating addOrUpdateRating(User user, Recipe recipe, Integer score) {
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndRecipeId(user.getId(), recipe.getId());
        if (existingRating.isPresent()) {
            existingRating.get().setScore(score);
            return ratingRepository.save(existingRating.get());
        } else {
            Rating rating = new Rating(score, user, recipe);
            return ratingRepository.save(rating);
        }
    }

    public List<Rating> getRatingsByRecipe(Recipe recipe) {
        return ratingRepository.findByRecipeId(recipe.getId());
    }

    public Double getAverageRating(Recipe recipe) {
        return ratingRepository.findAverageRatingByRecipeId(recipe.getId());
    }

    public Optional<Rating> getUserRatingForRecipe(User user, Recipe recipe) {
        return ratingRepository.findByUserIdAndRecipeId(user.getId(), recipe.getId());
    }
}
