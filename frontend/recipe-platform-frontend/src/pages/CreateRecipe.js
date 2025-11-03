import React, { useState ,useEffect} from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'VEGETARIAN',
    imageUrl: '',
    videoUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // <-- Get the ID from the URL
  const isEditMode = Boolean(id);


  useEffect(() => {
    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token');
          // Note: We need the token for GET /api/recipes/{id}
          const response = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          // Pre-fill the form
          setFormData({
            title: response.data.title,
            description: response.data.description,
            ingredients: response.data.ingredients,
            instructions: response.data.instructions,
            category: response.data.category,
            imageUrl: response.data.imageUrl || '',
            videoUrl: response.data.videoUrl || ''
          });
        } catch (err) {
          setError('Failed to load recipe data for editing.');
        }
      };
      fetchRecipe();
    }
  }, [id, isEditMode]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;

      if (isEditMode) {
        // UPDATE existing recipe
        response = await axios.put(`http://localhost:8080/api/recipes/${id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSuccess('Recipe updated successfully!');
      } else {
        // CREATE new recipe
        response = await axios.post('http://localhost:8080/api/recipes', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSuccess('Recipe created successfully!');
      }

      setError('');
      // Navigate to the recipe detail page after 2 seconds
      setTimeout(() => navigate(`/recipe/${response.data.id}`), 2000);

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit recipe. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {/* --- Change title based on mode --- */}
          {isEditMode ? 'Edit Your Recipe' : 'Create New Recipe'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Recipe Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="ingredients"
            label="Ingredients (one per line)"
            name="ingredients"
            multiline
            rows={5}
            value={formData.ingredients}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="instructions"
            label="Instructions"
            name="instructions"
            multiline
            rows={8}
            value={formData.instructions}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="VEGETARIAN">Vegetarian</MenuItem>
              <MenuItem value="VEGAN">Vegan</MenuItem>
              <MenuItem value="NON_VEGETARIAN">Non-Vegetarian</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            id="imageUrl"
            label="Image URL (optional)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="videoUrl"
            label="Video URL (optional)"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Recipe
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRecipe;
