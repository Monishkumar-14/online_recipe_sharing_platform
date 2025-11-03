package com.recipeplatform.controller;

import com.recipeplatform.dto.RecipeDto;
import com.recipeplatform.model.Comment;
import com.recipeplatform.model.Rating;
import com.recipeplatform.model.User;
import com.recipeplatform.service.CommentService;
import com.recipeplatform.service.RatingService;
import com.recipeplatform.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private RatingService ratingService;

    // Endpoint for "My Recipes"
    @GetMapping("/my-recipes")
    public ResponseEntity<List<RecipeDto>> getMyRecipes(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recipeService.getMyRecipes(user));
    }

    // Endpoint for "My Comments"
    @GetMapping("/my-comments")
    public ResponseEntity<List<Comment>> getMyComments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(commentService.getCommentsByUser(user));
    }

    // Endpoint for "My Ratings"
    @GetMapping("/my-ratings")
    public ResponseEntity<List<Rating>> getMyRatings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ratingService.getRatingsByUser(user));
    }
}
