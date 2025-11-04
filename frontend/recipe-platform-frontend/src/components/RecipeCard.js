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
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card 
      sx={{ 
        height: 430, // fixed static height
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        width : 368,
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
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch' 
        }}
      >
        {/* --- Image Section --- */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={recipe.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=Recipe'}
            alt={recipe.title}
            sx={{
              height: 180,
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          />
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

        {/* --- Content Section --- */}
        <CardContent
          sx={{ 
            flexGrow: 1, 
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%', // ensures fixed distribution inside
          }}
        >
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
              minHeight: '2.6em'
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
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3, // limit to 3 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {recipe.description}
          </Typography>

          {/* Author + Rating Container */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
