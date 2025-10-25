import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Chip, Rating, Button, TextField, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const fetchRecipe = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/recipes/${id}`,{
        headers: { Authorization: `Bearer ${token}` }, // <-- ADD THIS HEADER
      });
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/recipes/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/recipes/${id}/ratings/average`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }, [id]);


  useEffect(() => {
    fetchRecipe();
    fetchComments();
    fetchAverageRating();
  }, [fetchRecipe, fetchComments, fetchAverageRating]);

  const handleRatingChange = async (event, newValue) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/recipes/${id}/ratings`, { score: newValue }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRating(newValue);
      fetchAverageRating();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/recipes/${id}/comments`, { content: newComment }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!recipe) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {recipe.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Chip label={recipe.category} color="primary" sx={{ mr: 2 }} />
        <Typography variant="body1" sx={{ mr: 2 }}>
          By: {recipe.user?.username || 'Unknown'}
        </Typography>
        <Rating value={averageRating} readOnly precision={0.5} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          ({averageRating.toFixed(1)})
        </Typography>
      </Box>

      {recipe.imageUrl && (
        <Box sx={{ mb: 3 }}>
          <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Description
      </Typography>
      <Typography variant="body1" paragraph>
        {recipe.description}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Ingredients
      </Typography>
      <List>
        {recipe.ingredients.split('\n').map((ingredient, index) => (
          <ListItem key={index}>
            <ListItemText primary={ingredient} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>
        Instructions
      </Typography>
      <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-line' }}>
        {recipe.instructions}
      </Typography>

      {recipe.videoUrl && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Video
          </Typography>
          <video controls style={{ width: '100%', maxHeight: '400px' }}>
            <source src={recipe.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Rate this Recipe
      </Typography>
      <Rating
        value={userRating}
        onChange={handleRatingChange}
        size="large"
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleCommentSubmit} sx={{ mt: 1 }}>
          Post Comment
        </Button>
      </Box>

      <List>
        {comments.map((comment) => (
          <Paper key={comment.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {comment.user?.username || 'Anonymous'} - {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              {comment.content}
            </Typography>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default RecipeDetail;
