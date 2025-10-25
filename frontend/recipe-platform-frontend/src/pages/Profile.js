import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserRecipes();
    // In a real app, you'd fetch user details from token or API
    setUser({ username: 'Current User' });
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      // Assuming we have a way to get current user ID, for now using a placeholder
      const response = await axios.get('http://localhost:8080/api/recipes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Filter recipes by current user (this would be done on backend in real app)
      setUserRecipes(response.data.slice(0, 5)); // Placeholder
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Welcome, {user?.username}!</Typography>
        <Button variant="contained" component={Link} to="/create-recipe" sx={{ mt: 2 }}>
          Create New Recipe
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        My Recipes
      </Typography>

      {userRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {userRecipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any recipes yet.
          </Typography>
          <Button variant="contained" component={Link} to="/create-recipe">
            Create Your First Recipe
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
