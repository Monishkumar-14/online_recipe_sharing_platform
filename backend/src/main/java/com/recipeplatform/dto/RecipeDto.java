package com.recipeplatform.dto;

import com.recipeplatform.model.Recipe;

public class RecipeDto {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Recipe.Category category;
    private String username;
    private Double averageRating; // This will hold the calculated average

    // Constructor that Hibernate will use
    public RecipeDto(Long id, String title, String description, String imageUrl, 
                     Recipe.Category category, String username, Double averageRating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.username = username;
        this.averageRating = (averageRating == null) ? 0.0 : averageRating; // Ensure it's not null
    }

    // Getters for all fields
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public Recipe.Category getCategory() { return category; }
    public String getUsername() { return username; }
    public Double getAverageRating() { return averageRating; }
}