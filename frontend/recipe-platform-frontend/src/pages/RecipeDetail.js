import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Chip, 
  Rating, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper, 
  IconButton,
  CircularProgress,
  Avatar,
  CardMedia, // Use CardMedia directly for the top image
  Grid,
  Tooltip
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  PersonAdd, 
  PersonRemove,
  Restaurant as RestaurantIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  ArrowBack as ArrowBackIcon,
  MenuBook as MenuBookIcon,
  Kitchen as KitchenIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user info from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (userId && userRole && token) {
      setCurrentUser({ id: parseInt(userId, 10), role: userRole, token: token });
    }
  }, []);
  
  // --- Data Fetching Callbacks ---
  const fetchRecipe = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
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

  const checkFollowStatus = useCallback(async (cookId) => {
    if (!currentUser) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/follow/${cookId}/status`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [currentUser]);

  // Main data fetching effect
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchRecipe(),
        fetchComments(),
        fetchAverageRating()
      ]);
      setIsLoading(false);
    };
    fetchAll();
  }, [fetchRecipe, fetchComments, fetchAverageRating]);

  // Effect to check follow status AFTER recipe is loaded
  useEffect(() => {
    if (recipe && currentUser && recipe.user.id !== currentUser.id) {
      checkFollowStatus(recipe.user.id);
    }
  }, [recipe, currentUser, checkFollowStatus]);

  // --- Action Handlers ---
  const handleRatingChange = async (event, newValue) => {
    if (!currentUser) {
      alert("Please log in to rate recipes.");
      return;
    }
    try {
      await axios.post(`http://localhost:8080/api/recipes/${id}/ratings`, { score: newValue }, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setUserRating(newValue);
      fetchAverageRating();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      alert("Please log in to post comments.");
      return;
    }
    try {
      await axios.post(`http://localhost:8080/api/recipes/${id}/comments`, { content: newComment }, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteRecipe = async () => {
    if (window.confirm('Are you sure you want to delete this recipe? This action is permanent.')) {
      try {
        await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        navigate('/');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`http://localhost:8080/api/recipes/${id}/comments/${commentId}`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert("Please log in to follow cooks.");
      return;
    }
    
    const cookId = recipe.user.id;
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/${cookId}`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:8080/api/follow/${cookId}`, {}, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      alert(error.response?.data?.message || "Action failed. You can only follow COOKS.");
    }
  };

  // --- Loading State ---
  if (isLoading || !recipe) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // --- Computed Booleans for Readability ---
  const isAuthorOrAdmin = currentUser && 
    (currentUser.id === recipe.user?.id || currentUser.role === 'ROLE_ADMIN');
  const canFollow = currentUser && recipe.user?.id && currentUser.id !== recipe.user?.id;

  // --- Main Render ---
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
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            textTransform: 'none',
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Back
        </Button>

        {/* --- HERO CARD (IMAGE + HEADER) --- */}
        <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          {/* 1. Recipe Image */}
          {recipe.imageUrl && (
            <CardMedia
              component="img"
              image={recipe.imageUrl}
              alt={recipe.title}
              sx={{ 
                height: { xs: 250, sm: 400 }, 
                objectFit: 'cover'
              }}
            />
          )}

          {/* 2. Recipe Header */}
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ flex: 1, pr: 1 }}>
                <Chip 
                  label={recipe.category} 
                  color="primary" 
                  size="small"
                  sx={{ fontWeight: 600, mb: 2 }}
                />
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight={700}
                  color="text.primary"
                  gutterBottom
                >
                  {recipe.title}
                </Typography>
                
                {/* Author Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {recipe.user?.username ? recipe.user.username.substring(0, 2).toUpperCase() : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.2 }}>
                      Recipe by
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {recipe.user?.username || 'Unknown'}
                    </Typography>
                  </Box>
                  
                  {canFollow && (
                    <Button
                      variant={isFollowing ? "contained" : "outlined"}
                      size="small"
                      startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
                      onClick={handleFollowToggle}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 1,
                        ml: { xs: 0, sm: 'auto' }
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Edit/Delete Buttons */}
              {isAuthorOrAdmin && (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Tooltip title="Edit recipe">
                    <IconButton
                      component={Link}
                      to={`/edit-recipe/${id}`}
                      color="primary"
                      aria-label="edit recipe"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete recipe">
                    <IconButton
                      onClick={handleDeleteRecipe}
                      color="error"
                      aria-label="delete recipe"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
        {/* --- END OF HERO CARD --- */}


        <Grid container spacing={4}>
          {/* Left Column - Main Content Flow */}
          <Grid item xs={12} md={8}>
            {/* --- 3. Description --- */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon color="primary" />
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {recipe.description}
              </Typography>
            </Paper>

            {/* --- 4. Ingredients --- */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KitchenIcon color="primary" />
                Ingredients
              </Typography>
              <Box sx={{ bgcolor: '#fafafa', borderRadius: 1, p: 2 }}>
                <List>
                  {recipe.ingredients.split('\n').filter(line => line.trim()).map((ingredient, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={`• ${ingredient.trim()}`}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>

            {/* --- 5. Instructions --- */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon color="primary" />
                Instructions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line', bgcolor: '#fafafa', p: 2, borderRadius: 1 }}>
                {recipe.instructions}
              </Typography>
            </Paper>

            {/* --- 6. Video --- */}
            {recipe.videoUrl && (
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Video Tutorial
                </Typography>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                  <video controls style={{ width: '100%', display: 'block' }}>
                    <source src={recipe.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Community Sidebar */}
          <Grid 
            item 
            xs={12} 
            md={4}
          >
            {/* --- 7. Rating Section --- */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StarIcon sx={{ color: '#ffc107', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Rate Recipe
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Average Rating Display */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {averageRating.toFixed(1)}
                </Typography>
                <Rating value={averageRating} readOnly precision={0.5} size="large" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* User's Personal Rating */}
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Your Rating
              </Typography>
              <Rating
                value={userRating}
                onChange={handleRatingChange}
                size="large"
                disabled={!currentUser}
                sx={{ mb: 1 }}
              />
              {!currentUser && (
                <Typography variant="caption" color="text.secondary">
                  Please log in to rate this recipe.
                </Typography>
              )}
            </Paper>

            {/* --- 8. Comments Section --- */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CommentIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Comments
                </Typography>
                <Chip label={comments.length} size="small" color="primary" sx={{ ml: 'auto' }} />
              </Box>

              {/* Add Comment */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={currentUser ? "Share your thoughts..." : "Please log in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!currentUser}
                  sx={{ mb: 2, bgcolor: '#fafafa' }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleCommentSubmit} 
                  disabled={!currentUser || !newComment.trim()}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1,
                    py: 1.2
                  }}
                >
                  Post Comment
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Comments List */}
              <List sx={{ p: 0, maxHeight: 500, overflowY: 'auto' }}>
                {comments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#fafafa', borderRadius: 1 }}>
                    <CommentIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  </Box>
                ) : (
                  comments.map((comment, index) => {
                    const canDeleteComment = currentUser &&
                      (currentUser.id === comment.user?.id || currentUser.role === 'ROLE_ADMIN');

                    return (
                      <React.Fragment key={comment.id}>
                        {index > 0 && <Divider sx={{ my: 2 }} />}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: 'primary.light',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {comment.user?.username ? comment.user.username.substring(0, 2).toUpperCase() : 'A'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {comment.user?.username || 'Anonymous'}
                              </Typography>
                              {canDeleteComment && (
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteComment(comment.id)} 
                                    color="error"
                                    aria-label="delete comment"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 12 }} />
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                              {comment.content}
                            </Typography>
                          </Box>
                        </Box>
                      </React.Fragment>
                    );
                  })
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RecipeDetail;

