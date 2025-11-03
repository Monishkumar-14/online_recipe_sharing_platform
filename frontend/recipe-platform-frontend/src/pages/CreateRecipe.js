import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MenuBook as MenuBookIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: 'VEGETARIAN',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);


  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchRecipe = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setFormData({
            title: response.data.title,
            description: response.data.description,
            ingredients: response.data.ingredients,
            instructions: response.data.instructions,
            category: response.data.category,
            imageUrl: response.data.imageUrl || '',
          });
        } catch (err) {
          setError('Failed to load recipe data for editing.');
        } finally {
          setLoading(false);
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

      const { videoUrl, ...dataToSend } = formData;

      if (isEditMode) {
        response = await axios.put(`http://localhost:8080/api/recipes/${id}`, dataToSend, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSuccess('Recipe updated successfully!');
      } else {
        response = await axios.post(`http://localhost:8080/api/recipes`, dataToSend, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSuccess('Recipe created successfully!');
      }

      setError('');
      setTimeout(() => navigate(`/recipe/${response.data.id}`), 2000);

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit recipe. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container component="main" maxWidth="md">
        <Button
          onClick={() => navigate(isEditMode ? `/recipe/${id}` : '/')}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {isEditMode ? 'Back to Recipe' : 'Back to Home'}
        </Button>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <MenuBookIcon />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight={700}>
              {isEditMode ? 'Edit Your Recipe' : 'Create New Recipe'}
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {/* --- ALL GRID COMPONENTS REMOVED --- */}
              {/* Fields are now in a simple vertical stack */}
              
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
                helperText="Please list each ingredient on a new line."
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
              
              {/* --- Error and Success Alerts --- */}
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, borderRadius: 1 }}
              >
                {isEditMode ? 'Update Recipe' : 'Submit Recipe'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateRecipe;

