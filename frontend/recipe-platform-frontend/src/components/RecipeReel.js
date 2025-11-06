import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar,
  Button,
  Chip,
  Rating,
  alpha
} from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeReel = ({ recipe }) => {
  return (
    <Box 
      sx={{
        marginTop :8.5,
        height: '90%', // Use 100% to fit inside the snap container
        width: '100%',
        position: 'relative', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderRadius: { xs: 0, sm: 3 }, // Add border radius on larger screens
        overflow: 'hidden' // Clip the corners
      }}
    >
      {/* 1. Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${recipe.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=Recipe'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* 2. Gradient Overlay (to make text readable) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.1) 60%)',
        }}
      />

      {/* 3. Content (on top of the gradient) */}
      <Box sx={{ position: 'relative', p: { xs: 2, sm: 4 }, color: 'white' }}>
        {/* Author Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: 'primary.main',
              fontSize: '0.875rem'
            }}
          >
            {/* This uses recipe.username. If it shows "Unknown", 
              it means your backend is not sending the username correctly.
              Please check your RecipeRepository.java file.
            */}
            {(recipe.username || 'U')[0].toUpperCase()}
          </Avatar>
          <Typography variant="body1" fontWeight={600}>
            {recipe.username || 'Unknown'}
          </Typography>
        </Box>

        {/* Title */}
        <Typography 
          variant="h5" 
          component="h2"
          fontWeight={700}
          sx={{
            mb: 1.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            color: 'white' // <-- 1. EXPLICITLY SET FONT COLOR TO WHITE
          }}
        >
          {recipe.title}
        </Typography>

        {/* Description (truncated) */}
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2,
            color: alpha('#fff', 0.85),
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {recipe.description}
        </Typography>

        {/* Rating & Category */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {typeof recipe.averageRating === 'number' && recipe.averageRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating 
                value={recipe.averageRating} 
                readOnly 
                precision={0.5} 
                size="small"
                sx={{ 
                  '& .MuiRating-iconFilled': { color: '#FFA726' },
                  '& .MSuiRating-iconEmpty': { color: alpha('#fff', 0.3) }
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {recipe.averageRating.toFixed(1)}
              </Typography>
            </Box>
          )}
          <Chip 
            label={recipe.category} 
            size="small"
            sx={{
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              fontWeight: 600,
              textTransform: 'capitalize'
            }}
          />
        </Box>

        {/* View Recipe Button */}
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to={`/recipe/${recipe.id}`}
          fullWidth
          sx={{ 
            py: 1.2, 
            fontWeight: 700,
            borderRadius: 2
          }}
        >
          View Full Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeReel;