package com.recipeplatform.controller;

import com.recipeplatform.model.Comment;
import com.recipeplatform.model.CommentRequest;
import com.recipeplatform.model.User;
import com.recipeplatform.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // GET /api/recipes/{recipeId}/comments
    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long recipeId) {
        // Updated method name
        return ResponseEntity.ok(commentService.getCommentsForRecipe(recipeId));
    }

    // POST /api/recipes/{recipeId}/comments
    @PostMapping
    public ResponseEntity<Comment> postComment(@PathVariable Long recipeId,
                                               @AuthenticationPrincipal User user,
                                               @RequestBody CommentRequest commentRequest) {
        // Updated method name and parameters
        Comment savedComment = commentService.postComment(recipeId, user, commentRequest);
        return ResponseEntity.ok(savedComment);
    }
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId,
                                                @PathVariable Long commentId,
                                                @AuthenticationPrincipal User user) {
        commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }
    // Note: deleteComment logic would require more checks, but here is a simple version
    // You would also need to add deleteComment to your CommentService
    /*
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long recipeId,
                                                @PathVariable Long commentId,
                                                @AuthenticationPrincipal User user) {
        // TODO: Add logic to CommentService to check if user is admin or comment author
        // commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }
    */
}
