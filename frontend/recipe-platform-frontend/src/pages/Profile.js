import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Rating,
  Avatar,
  Chip,
  Card,
  CardContent,
  alpha,
  Stack
} from '@mui/material';
import { 
  Restaurant,
  Comment,
  Star,
  RateReview,
  MenuBook
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUserRecipes = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/profile/my-recipes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRecipes(response.data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  }, []);

  const fetchMyComments = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/profile/my-comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyComments(response.data);
    } catch (error) {
      console.error('Error fetching user comments:', error);
    }
  }, []);

  const fetchMyRatings = useCallback(async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/profile/my-ratings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyRatings(response.data);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (username) {
      setUser({ username: username });
    }

    if (token) {
      fetchUserRecipes(token);
      fetchMyComments(token);
      fetchMyRatings(token);
    }
  }, [fetchUserRecipes, fetchMyComments, fetchMyRatings]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (myRatings.length === 0) return 0;
    const sum = myRatings.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / myRatings.length).toFixed(1);
  };

  return (
    // ✅ Use the same background as Home.js
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Profile Header Card */}
        <Paper 
          elevation={3} // Give it a shadow like the Navbar
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            // ✅ Use the blue gradient from Navbar/Home.js
            background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.1),
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80,
                bgcolor: 'white',
                // ✅ Use the theme's dark blue
                color: '#1565c0', 
                fontSize: '2rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {user?.username || 'User'}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Chip 
                  icon={<MenuBook />}
                  label={`${userRecipes.length} Recipes`}
                  sx={{ 
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Chip 
                  icon={<Comment />}
                  label={`${myComments.length} Comments`}
                  sx={{ 
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label={`${myRatings.length} Ratings`}
                  sx={{ 
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Column 1: My Recipes */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Restaurant color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>
                My Recipes
              </Typography>
              {/* ✅ Styled counter chip */}
              <Chip 
                label={userRecipes.length} 
                size="small" 
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 5,
                  color: 'white',
                  background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            {userRecipes.length > 0 ? (
              <Grid container spacing={3}>
                {userRecipes.map((recipe) => (
                  <Grid item key={recipe.id} xs={12} sm={6}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Restaurant sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Recipes Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You haven't created any recipes yet. Start sharing your culinary creations!
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Column 2: My Activity */}
          <Grid item xs={12} md={4}>
            {/* Statistics Card */}
            {myRatings.length > 0 && (
              // ✅ Replaced pink gradient with a white card
              <Paper 
                elevation={3}
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  bgcolor: 'white',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Star color="primary" />
                    <Typography variant="h6" fontWeight={600} color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                  {/* ✅ Use text gradient for the number */}
                  <Typography 
                    variant="h2" 
                    fontWeight={800}
                    sx={{
                      background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {calculateAverageRating()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on {myRatings.length} {myRatings.length === 1 ? 'rating' : 'ratings'}
                  </Typography>
                </CardContent>
              </Paper>
            )}

            {/* My Ratings Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <RateReview color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  My Ratings
                </Typography>
                {/* ✅ Styled counter chip */}
                <Chip 
                  label={myRatings.length} 
                  size="small" 
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 5,
                    color: 'white',
                    background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
                <List disablePadding>
                  {myRatings.length > 0 ? (
                    myRatings.slice(0, 5).map((rating, index) => (
                      <React.Fragment key={rating.id}>
                        <ListItem 
                          sx={{ 
                            py: 2,
                            '&:hover': {
                              bgcolor: alpha('#1976d2', 0.04)
                            }
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Rating value={rating.score} readOnly size="small" />
                                <Typography variant="body2" fontWeight={600} color="text.secondary">
                                  {rating.score}/5
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography 
                                variant="body2" 
                                component={Link} 
                                to={`/recipe/${rating.recipe.id}`}
                                sx={{ 
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                {rating.recipe.title}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < myRatings.length - 1 && index < 4 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem sx={{ py: 4, textAlign: 'center', display: 'block' }}>
                      <Star sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <ListItemText 
                        primary={
                          <Typography color="text.secondary">
                            You haven't rated any recipes yet.
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Box>

            {/* My Comments Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Comment color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  My Comments
                </Typography>
                {/* ✅ Styled counter chip */}
                <Chip 
                  label={myComments.length} 
                  size="small" 
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 5,
                    color: 'white',
                    background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
                <List disablePadding>
                  {myComments.length > 0 ? (
                    myComments.slice(0, 5).map((comment, index) => (
                      <React.Fragment key={comment.id}>
                        <ListItem 
                          sx={{ 
                            py: 2,
                            '&:hover': {
                              bgcolor: alpha('#1976d2', 0.04)
                            }
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontStyle: 'italic',
                                  color: 'text.primary',
                                  mb: 0.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                "{comment.content}"
                              </Typography>
                            }
                            secondary={
                              <Typography 
                                variant="caption" 
                                component={Link} 
                                to={`/recipe/${comment.recipe.id}`}
                                sx={{ 
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                on {comment.recipe.title}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < myComments.length - 1 && index < 4 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem sx={{ py: 4, textAlign: 'center', display: 'block' }}>
                      <Comment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <ListItemText 
                        primary={
                          <Typography color="text.secondary">
                            You haven't posted any comments yet.
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;