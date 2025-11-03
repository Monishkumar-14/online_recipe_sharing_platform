import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Chip, Rating, Button, TextField, List, ListItem, ListItemText, Divider, Paper, IconButton } from '@mui/material'; // <-- Import IconButton
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // <-- Import icons
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- Import useNavigate and Link
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- Get navigate function
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);


  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // You need to save this on login
    const userRole = localStorage.getItem('role');
    if (userId) {
      // Note: We need to parse userId to a number for comparisons
      setCurrentUser({ id: parseInt(userId, 10), role: userRole });
    }
  }, []);


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
  const handleDeleteRecipe = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        navigate('/'); // Navigate to home page after delete
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe.');
      }
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/recipes/${id}/comments/${commentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchComments(); // Refresh comments list
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    }
  };
  if (!recipe) {
    return <Typography>Loading...</Typography>;
  }
  const isAuthorOrAdmin = currentUser && 
  (currentUser.id === recipe.user?.id || currentUser.role === 'ROLE_ADMIN');
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {isAuthorOrAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            component={Link}
            to={`/edit-recipe/${id}`}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteRecipe}
          >
            Delete
          </Button>
        </Box>
      )}
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
        {comments.map((comment) => {
          // Check if user can delete this specific comment
          const canDeleteComment = currentUser &&
            (currentUser.id === comment.user?.id || currentUser.role === 'ROLE_ADMIN');

          return (
            <Paper key={comment.id} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {comment.user?.username || 'Anonymous'} - {new Date(comment.createdAt).toLocaleDateString()}
                </Typography>
                {/* --- ADD DELETE BUTTON FOR COMMENT --- */}
                {canDeleteComment && (
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteComment(comment.id)} 
                    aria-label="delete comment"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body1">
                {comment.content}
              </Typography>
            </Paper>
          );
        })}
      </List>
    </Container>
  );
};

export default RecipeDetail;
