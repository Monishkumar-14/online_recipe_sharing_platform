import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  TextField, 
  InputAdornment, 
  Chip, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Alert,
  Paper,
  alpha,
  Fade
} from '@mui/material';
import { 
  Search,
  Explore,
  RssFeed,
  FilterList
} from '@mui/icons-material';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tab, setTab] = useState(0); // 0 = Discover, 1 = Following
  const [error, setError] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  const fetchRecipes = useCallback(async () => {
    try {
      setError('');
      let url = 'http://localhost:8080/api/recipes';
      const token = localStorage.getItem('token');
      
      // Check which tab is active
      if (tab === 1 && isLoggedIn) {
        url = 'http://localhost:8080/api/recipes/feed';
      }

      // Check for search or category (only on Discover tab)
      if (tab === 0) {
        if (searchTerm) {
          url = `http://localhost:8080/api/recipes/search?keyword=${searchTerm}`;
        } else if (selectedCategory) {
          url = `http://localhost:8080/api/recipes/category/${selectedCategory}`;
        }
      }
      
      const response = await axios.get(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Could not fetch recipes.');
    }
  }, [searchTerm, selectedCategory, tab, isLoggedIn]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    // Clear search and category when switching tabs
    setSearchTerm('');
    setSelectedCategory('');
  };

  const categories = ['VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN'];

  const formatCategoryLabel = (category) => {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    // Use a light background color to make the white Paper elements "pop"
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Header */}
        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left'} }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={800}
            sx={{
              // ✅ Changed to 90deg to match the Navbar's gradient
              background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Discover Delicious Recipes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Explore thousands of recipes from talented home cooks
          </Typography>
        </Box>

        {/* Navigation & Filters Card */}
        <Paper 
          elevation={3} // Give it a slight shadow like the Navbar
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3, // Slightly rounded card
            bgcolor: 'white'
          }}
        >
          {/* Tabs for Discover/Following */}
          {isLoggedIn && (
            <Tabs 
              value={tab} 
              onChange={handleTabChange} 
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600, // Matches Navbar link font weight
                  minHeight: 48
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#1976d2'
                },
                '& .Mui-selected': {
                  color: '#1976d2 !important'
                }
              }}
            >
              <Tab 
                icon={<Explore sx={{ mr: 1 }} />} 
                iconPosition="start"
                label="Discover" 
              />
              <Tab 
                icon={<RssFeed sx={{ mr: 1 }} />} 
                iconPosition="start"
                label="Following" 
              />
            </Tabs>
          )}

          {/* Search and Category Filters (Only show on Discover tab) */}
          {tab === 0 && (
            <Fade in={tab === 0}>
              <Box>
                {/* Search Bar */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      // Match the "pill" style of the Navbar button
                      borderRadius: 5, 
                      bgcolor: alpha('#000', 0.02),
                      '&:hover': {
                        bgcolor: alpha('#000', 0.04),
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        borderColor: '#1976d2'
                      }
                    }
                  }}
                />

                {/* Category Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                    <FilterList color="action" fontSize="small" />
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Filter by:
                    </Typography>
                  </Box>
                  <Chip
                    label="All Recipes"
                    onClick={() => setSelectedCategory('')}
                    color={selectedCategory === '' ? 'primary' : 'default'}
                    variant={selectedCategory === '' ? 'filled' : 'outlined'}
                    sx={{
                      fontWeight: 600,
                      // ✅ Match the Navbar Login button style
                      borderRadius: 5, 
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&.MuiChip-filledPrimary': {
                        backgroundColor: '#1976d2',
                        // Match gradient button
                        background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                      },
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
                      },
                    }}
                  />
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={formatCategoryLabel(category)}
                      onClick={() => setSelectedCategory(category)}
                      color={selectedCategory === category ? 'primary' : 'default'}
                      variant={selectedCategory === category ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 600,
                        // ✅ Match the Navbar Login button style
                        borderRadius: 5, 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&.MuiChip-filledPrimary': {
                          backgroundColor: '#1976d2',
                          // Match gradient button
                          background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                        },
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Recipe Grid */}
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {recipes.length === 0 && !error && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 8 },
              textAlign: 'center',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'white',
              mt: 4
            }}
          >
            <Box sx={{ mb: 2 }}>
              {tab === 1 ? <RssFeed sx={{ fontSize: 64, color: 'text.disabled' }} /> : <Search sx={{ fontSize: 64, color: 'text.disabled' }} />}
            </Box>
            <Typography variant="h5" fontWeight={600} gutterBottom color="text.secondary">
              {tab === 1 ? "No Recipes in Your Feed" : "No Recipes Found"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tab === 1 
                ? "You're not following any cooks yet, or they haven't posted recipes." 
                : "Try adjusting your search or filter criteria."}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Home;