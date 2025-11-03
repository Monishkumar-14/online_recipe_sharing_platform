package com.recipeplatform.service;

import com.recipeplatform.model.Comment;
import com.recipeplatform.model.CommentRequest;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.CommentRepository;
import com.recipeplatform.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException; // <-- IMPORT
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    public List<Comment> getCommentsForRecipe(Long recipeId) {
        return commentRepository.findAllByRecipeId(recipeId);
    }

    public Comment postComment(Long recipeId, User user, CommentRequest commentRequest) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        Comment comment = new Comment();
        comment.setContent(commentRequest.content());
        comment.setRecipe(recipe);
        comment.setUser(user);
        
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByUser(User user) {
        return commentRepository.findByUserIdWithRecipe(user.getId());
    }

    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Security Check: Allow if user is author OR user is an ADMIN
        if (!comment.getUser().getId().equals(user.getId()) && 
            !user.getRole().equals(User.Role.ADMIN)) {
            throw new AccessDeniedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
