package com.recipeplatform.repository;

import com.recipeplatform.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List; // <-- IMPORT THIS
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.recipe.id = :recipeId")
    Double getAverageRatingByRecipeId(Long recipeId);

    Optional<Rating> findByRecipeIdAndUserId(Long recipeId, Long userId);

    // --- ADD THIS METHOD ---
    @Query("SELECT r FROM Rating r JOIN FETCH r.recipe WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Rating> findByUserIdWithRecipe(Long userId);
}
