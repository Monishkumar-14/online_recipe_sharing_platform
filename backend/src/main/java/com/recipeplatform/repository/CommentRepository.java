package com.recipeplatform.repository;

import com.recipeplatform.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Efficiently finds all comments by a user and joins the recipe data
    @Query("SELECT c FROM Comment c JOIN FETCH c.recipe WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<Comment> findByUserIdWithRecipe(Long userId);

    List<Comment> findAllByRecipeId(Long recipeId);
}
