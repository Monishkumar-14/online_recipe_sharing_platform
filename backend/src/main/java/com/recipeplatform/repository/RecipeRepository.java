package com.recipeplatform.repository;

import com.recipeplatform.model.Recipe;
import com.recipeplatform.model.Recipe.Category;
import com.recipeplatform.dto.RecipeDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    // Finds recipes by category (used in Home.js)
    List<Recipe> findByCategory(Category category);

    // Finds recipes by title (used in Home.js search)
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    
    // Finds recipes by user ID (used in original Profile.js)
    List<Recipe> findByUserId(Long userId);

    // Finds recipes by keyword in title or description (used in Home.js search)
    @Query("SELECT r FROM Recipe r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Recipe> searchByKeyword(@Param("keyword") String keyword);

    // Gets top-rated recipes (for a potential future feature)
    @Query("SELECT r FROM Recipe r LEFT JOIN r.ratings rat GROUP BY r ORDER BY AVG(rat.score) DESC")
    List<Recipe> getTopRatedRecipes();

    // Gets all recipes with average ratings (for Home.js "Discover" feed)
    @Query("SELECT new com.recipeplatform.dto.RecipeDto(r.id, r.title, r.description, r.imageUrl, r.category, r.user.username, AVG(rat.score)) " +
           "FROM Recipe r " +
           "JOIN r.user " +
           "LEFT JOIN r.ratings rat ON rat.recipe.id = r.id " +
           "GROUP BY r.id, r.user.username")
    List<RecipeDto> findAllRecipeCardData();

    // Gets all recipes for one user with average ratings (for Profile.js & Admin)
    @Query("SELECT new com.recipeplatform.dto.RecipeDto(r.id, r.title, r.description, r.imageUrl, r.category, r.user.username, AVG(rat.score)) " +
           "FROM Recipe r " +
           "JOIN r.user " +
           "LEFT JOIN r.ratings rat ON rat.recipe.id = r.id " +
           "WHERE r.user.id = :userId " +
           "GROUP BY r.id, r.user.username " +
           "ORDER BY r.createdAt DESC")
    List<RecipeDto> findMyRecipes(@Param("userId") Long userId);

    // Gets all recipes from a list of followed user IDs (for Home.js "Following" feed)
    @Query("SELECT new com.recipeplatform.dto.RecipeDto(r.id, r.title, r.description, r.imageUrl, r.category, r.user.username, AVG(rat.score)) " +
           "FROM Recipe r " +
           "JOIN r.user " +
           "LEFT JOIN r.ratings rat ON rat.recipe.id = r.id " +
           "WHERE r.user.id IN :followingIds " + // Filter by followed IDs
           "GROUP BY r.id, r.user.username " +
           "ORDER BY r.createdAt DESC") // Order by newest
    List<RecipeDto> findRecipesByFollowing(@Param("followingIds") List<Long> followingIds);
}