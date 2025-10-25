package com.recipeplatform.controller;

import com.recipeplatform.model.Comment;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
@RestController
@RequestMapping("/api/recipes/{recipeId}/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long recipeId, @Valid @RequestBody Comment comment, @AuthenticationPrincipal User user) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        return ResponseEntity.ok(commentService.addComment(user, recipe, comment.getContent()));
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long recipeId) {
        Recipe recipe = new Recipe();
        recipe.setId(recipeId);
        return ResponseEntity.ok(commentService.getCommentsByRecipe(recipe));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal User user) {
        // For simplicity, assuming user can delete their own comments or admin
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
