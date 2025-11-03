package com.recipeplatform.repository;

import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.Recipe.Category;
import com.recipeplatform.dto.RecipeDto; // <-- IMPORT THE DTO
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.repository.query.Param;
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCategory(Category category);
    List<Recipe> findByUserId(Long userId);
    List<Recipe> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Recipe> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT r FROM Recipe r LEFT JOIN r.ratings rat GROUP BY r ORDER BY AVG(rat.score) DESC")
    List<Recipe> findAllOrderByAverageRatingDesc();

    // REPLACE findAllWithUser() WITH THIS:
    @Query("SELECT new com.recipeplatform.dto.RecipeDto(r.id, r.title, r.description, r.imageUrl, r.category, r.user.username, AVG(rat.score)) " +
           "FROM Recipe r " +
           "JOIN r.user " +
           "LEFT JOIN r.ratings rat " +
           "GROUP BY r.id, r.user.username")
    List<RecipeDto> findAllRecipeCardData();
    @Query("SELECT new com.recipeplatform.dto.RecipeDto(r.id, r.title, r.description, r.imageUrl, r.category, r.user.username, AVG(rat.score)) " +
           "FROM Recipe r " +
           "JOIN r.user " +
           "LEFT JOIN r.ratings rat " +
           "WHERE r.user.id = :userId " +
           "GROUP BY r.id, r.user.username " +
           "ORDER BY r.createdAt DESC")
    List<RecipeDto> findMyRecipes(@Param("userId") Long userId);
}