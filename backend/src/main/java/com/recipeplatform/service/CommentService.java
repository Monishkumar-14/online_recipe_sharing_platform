package com.recipeplatform.service;

import com.recipeplatform.model.Comment;
import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.User;
import com.recipeplatform.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(User user, Recipe recipe, String content) {
        Comment comment = new Comment(content, user, recipe);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByRecipe(Recipe recipe) {
        return commentRepository.findByRecipeIdOrderByCreatedAtDesc(recipe.getId());
    }

    public List<Comment> getCommentsByUser(User user) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
