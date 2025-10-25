package com.recipeplatform.controller;

import com.recipeplatform.model.Rating;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/recipes/{recipeId}/ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@PathVariable Long recipeId, @RequestParam Integer score, @AuthenticationPrincipal User user) {
        // Assuming Recipe is fetched elsewhere, for simplicity, create a dummy Recipe object
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        return ResponseEntity.ok(ratingService.addOrUpdateRating(user, recipe, score));
    }

    @GetMapping
    public ResponseEntity<List<Rating>> getRatings(@PathVariable Long recipeId) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        return ResponseEntity.ok(ratingService.getRatingsByRecipe(recipe));
    }

    @GetMapping("/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long recipeId) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        Double average = ratingService.getAverageRating(recipe);
        return ResponseEntity.ok(Map.of("averageRating", average != null ? average : 0.0));
    }

    @GetMapping("/my-rating")
    public ResponseEntity<Rating> getMyRating(@PathVariable Long recipeId, @AuthenticationPrincipal User user) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        Optional<Rating> rating = ratingService.getUserRatingForRecipe(user, recipe);
        return rating.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
