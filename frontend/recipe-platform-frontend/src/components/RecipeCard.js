import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Rating, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={recipe.imageUrl || '/placeholder-recipe.jpg'}
        alt={recipe.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {recipe.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip label={recipe.category} color="primary" size="small" />
          <Typography variant="body2" color="text.secondary">
            By: {recipe.username || 'Unknown'}
          </Typography>
        </Box>
              {/* Only render the rating Box if recipe.averageRating is a number */}
              {typeof recipe.averageRating === 'number' && recipe.averageRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={recipe.averageRating} readOnly precision={0.5} size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({recipe.averageRating.toFixed(1)})
                  </Typography>
                </Box>
              )}
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
          <Typography variant="button" color="primary">
            View Recipe
          </Typography>
        </Link>
      </Box>
    </Card>
  );
};

export default RecipeCard;
