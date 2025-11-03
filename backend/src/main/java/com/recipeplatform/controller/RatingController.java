package com.recipeplatform.controller;

import com.recipeplatform.model.Rating;
import com.recipeplatform.model.RatingRequest;
import com.recipeplatform.model.User;
import com.recipeplatform.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recipes/{recipeId}/ratings")
@CrossOrigin(origins = "http://localhost:3000") // <-- IMPORTANT
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // Endpoint for submitting a new rating
    // POST /api/recipes/{recipeId}/ratings
    @PostMapping
    public ResponseEntity<Rating> submitRating(@PathVariable Long recipeId,
                                               @AuthenticationPrincipal User user,
                                               @RequestBody RatingRequest ratingRequest) {
        Rating savedRating = ratingService.submitRating(recipeId, user, ratingRequest);
        return ResponseEntity.ok(savedRating);
    }

    // Endpoint for getting the average rating
    // GET /api/recipes/{recipeId}/ratings/average
    @GetMapping("/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long recipeId) {
        return ResponseEntity.ok(ratingService.getAverageRating(recipeId));
    }
}