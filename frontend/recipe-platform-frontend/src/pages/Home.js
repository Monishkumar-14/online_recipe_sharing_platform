import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, TextField, InputAdornment, Chip, Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchRecipes = useCallback(async () => {
    try {
      let url = 'http://localhost:8080/api/recipes';
      if (searchTerm) {
        url = `http://localhost:8080/api/recipes/search?keyword=${searchTerm}`;
      } else if (selectedCategory) {
        url = `http://localhost:8080/api/recipes/category/${selectedCategory}`;
      }
      const response = await axios.get(url);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [searchTerm, selectedCategory]); // 3. Add its dependencies here

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const categories = ['VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Delicious Recipes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All"
            onClick={() => setSelectedCategory('')}
            variant={selectedCategory === '' ? 'filled' : 'outlined'}
            color="primary"
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              color="primary"
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} md={4}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      {recipes.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No recipes found. Be the first to share a recipe!
        </Typography>
      )}
    </Container>
  );
};

export default Home;
