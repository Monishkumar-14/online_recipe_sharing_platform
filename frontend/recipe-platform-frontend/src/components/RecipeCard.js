import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Rating, 
  Box,
  Avatar,
  CardActionArea
} from '@mui/material';
// Unused icons and 'alpha' removed
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        }
      }}
      elevation={2}
    >
      <CardActionArea 
        component={Link} 
        to={`/recipe/${recipe.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* --- IMAGE SECTION UPDATED --- */}
        {/* The 'Box' wrapper is no longer needed */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={recipe.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=Recipe'}
            alt={recipe.title}
            sx={{
              height: 180, // <-- Set a fixed height for all card images
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          {/* Category chip overlay */}
          <Chip 
            label={recipe.category} 
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'white',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              textTransform: 'capitalize'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 700,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              minHeight: '2.6em' // Reserves 2 lines for title
            }}
          >
            {recipe.title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              minHeight: '3em' // Reserves 2 lines for description
            }}
          >
            {recipe.description}
          </Typography>

          {/* Author info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28, 
                bgcolor: 'primary.main',
                fontSize: '0.75rem',
                mr: 1
              }}
            >
              {(recipe.username || 'U')[0].toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {recipe.username || 'Unknown'}
            </Typography>
          </Box>

          {/* Rating */}
          {typeof recipe.averageRating === 'number' && recipe.averageRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating 
                value={recipe.averageRating} 
                readOnly 
                precision={0.5} 
                size="small"
                sx={{ color: '#FFA726' }}
              />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {recipe.averageRating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;

