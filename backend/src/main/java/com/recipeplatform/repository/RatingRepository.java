package com.recipeplatform.repository;

import com.recipeplatform.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.recipe.id = :recipeId")
    Double getAverageRatingByRecipeId(Long recipeId);

    // Finds if a user has already rated this recipe
    Optional<Rating> findByRecipeIdAndUserId(Long recipeId, Long userId);
}
