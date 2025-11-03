import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  Alert,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const AdminUserRecipes = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Fetch the user's details (like username)
  const fetchUserInfo = useCallback(async (token) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      setError('Failed to fetch user details.');
      console.error(err);
    }
  }, [userId]);

  // Fetch all recipes for that user
  const fetchUserRecipes = useCallback(async (token) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}/recipes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to fetch user recipes.');
      console.error(err);
    }
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
      fetchUserRecipes(token);
    }
  }, [fetchUserInfo, fetchUserRecipes]);

  // Handle deleting a recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe? This action is permanent.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/recipes/${recipeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Remove from UI
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      } catch (err) {
        setError('Failed to delete recipe.');
        console.error(err);
      }
    }
  };

  // Get user avatar
  const getUserAvatar = (username) => {
    return (
      <Avatar 
        sx={{ 
          width: 60, 
          height: 60, 
          bgcolor: '#1976d2',
          fontSize: '1.25rem',
          fontWeight: 600
        }}
      >
        {username ? username.substring(0, 2).toUpperCase() : 'U'}
      </Avatar>
    );
  };

  // Get role chip
  const getRoleChip = (role) => {
    const roleConfig = {
      ADMIN: { color: 'error', label: 'Admin' },
      COOK: { color: 'success', label: 'Cook' },
      USER: { color: 'primary', label: 'User' }
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    
    return (
      <Chip 
        label={config.label} 
        color={config.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          component={RouterLink}
          to="/admin"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            textTransform: 'none',
            fontWeight: 600,
            color: '#1976d2'
          }}
        >
          Back to Dashboard
        </Button>

        {/* User Info Header */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 3,
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#f5f5f5',
                border: '2px solid #e0e0e0'
              }}
            >
              {user && getUserAvatar(user.username)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight={700}
                  color="text.primary"
                >
                  {user ? user.username : 'Loading...'}
                </Typography>
                {user && getRoleChip(user.role)}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {user ? user.email : ''}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Chip
                  icon={<RestaurantIcon sx={{ fontSize: 16 }} />}
                  label={`${recipes.length} ${recipes.length === 1 ? 'Recipe' : 'Recipes'}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mt: 3, borderRadius: 1 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
        </Paper>

        {/* Recipes Section */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3,
            borderRadius: 2,
            bgcolor: 'white',
            minHeight: 300
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
              Recipes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All recipes created by this user
            </Typography>
          </Box>

          {recipes.length > 0 ? (
            <Grid container spacing={3}>
              {recipes.map((recipe) => (
                <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                  <Box sx={{ position: 'relative' }}>
                    <RecipeCard recipe={recipe} />
                    <Tooltip title="Delete this recipe">
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                        sx={{ 
                          mt: 2,
                          py: 1.2,
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: '#c62828'
                          }
                        }}
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        Delete Recipe
                      </Button>
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#f5f5f5',
                  border: '2px solid #e0e0e0'
                }}
              >
                <RestaurantIcon sx={{ fontSize: 40, color: '#bdbdbd' }} />
              </Box>
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No recipes yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This user hasn't posted any recipes
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminUserRecipes;