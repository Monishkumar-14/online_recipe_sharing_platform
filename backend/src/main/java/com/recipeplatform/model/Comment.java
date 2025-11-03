package com.recipeplatform.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @JsonIgnore
    private Recipe recipe;

    // --- Constructors ---
    public Comment() {
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Recipe getRecipe() { return recipe; }
    public void setRecipe(Recipe recipe) { this.recipe = recipe; }

    // --- JSON Helpers for Frontend ---
    @JsonProperty("user")
    public Map<String, Object> getSimpleUser() {
        if (this.user != null) {
            Map<String, Object> simpleUser = new HashMap<>();
            simpleUser.put("id", this.user.getId());
            simpleUser.put("username", this.user.getUsername());
            return simpleUser;
        }
        return null;
    }

    @JsonProperty("recipe")
    public Map<String, Object> getSimpleRecipe() {
        if (this.recipe != null) {
            Map<String, Object> simpleRecipe = new HashMap<>();
            simpleRecipe.put("id", this.recipe.getId());
            simpleRecipe.put("title", this.recipe.getTitle());
            return simpleRecipe;
        }
        return null;
    }
}
