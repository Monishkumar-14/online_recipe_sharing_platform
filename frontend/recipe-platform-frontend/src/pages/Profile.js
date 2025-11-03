import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Button, Paper, List, ListItem, ListItemText, Divider, Rating } from '@mui/material';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Profile
        </Typography>
        <Button variant="contained" component={Link} to="/create-recipe">
          Create New Recipe
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>Welcome, {user?.username}!</Typography>

      <Grid container spacing={4}>
        {/* Column 1: My Recipes */}
        <Grid xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            My Recipes
          </Typography>
          {userRecipes.length > 0 ? (
            <Grid container spacing={3}>
              {userRecipes.map((recipe) => (
                <Grid key={recipe.id} xs={12} sm={6}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>You haven't created any recipes yet.</Typography>
          )}
        </Grid>

        {/* Column 2: My Activity */}
        <Grid xs={12} md={4}>
          {/* My Ratings Section */}
          <Typography variant="h5" gutterBottom>
            My Ratings
          </Typography>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <List>
              {myRatings.length > 0 ? (
                myRatings.slice(0, 5).map((rating, index) => ( // Show 5 most recent
                  <React.Fragment key={rating.id}>
                    <ListItem>
                      <ListItemText 
                        primary={<Rating value={rating.score} readOnly size="small" />}
                        secondary={
                          <>
                            for <Link to={`/recipe/${rating.recipe.id}`}>{rating.recipe.title}</Link>
                          </>
                        }
                      />
                    </ListItem>
                    {index < myRatings.length - 1 && index < 4 && <Divider component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="You haven't rated any recipes yet." />
                </ListItem>
              )}
            </List>
          </Paper>

          {/* My Comments Section */}
          <Typography variant="h5" gutterBottom>
            My Comments
          </Typography>
          <Paper elevation={2}>
            <List>
              {myComments.length > 0 ? (
                myComments.slice(0, 5).map((comment, index) => ( // Show 5 most recent
                  <React.Fragment key={comment.id}>
                    <ListItem>
                      <ListItemText 
                        primary={`"${comment.content}"`}
                        secondary={
                          <>
                            on <Link to={`/recipe/${comment.recipe.id}`}>{comment.recipe.title}</Link>
                          </>
                        }
                      />
                    </ListItem>
                    {index < myComments.length - 1 && index < 4 && <Divider component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="You haven't posted any comments yet." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
