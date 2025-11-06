import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  CircularProgress,
  Alert,
  Container // Import Container to center and narrow the feed
} from '@mui/material';
import RecipeReel from '../components/RecipeReel';
import axios from 'axios';

const ReelsFeed = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); // To track which reel is active
  const containerRef = useRef(null); // Ref for the main scrolling container

  // Fetch the top-rated recipes
  const fetchTopRated = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/api/recipes/top-rated');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching top-rated recipes:', error);
      setError('Could not fetch the feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRated();
  }, [fetchTopRated]);

  // Function to scroll to a specific recipe
  const scrollToRecipe = (index) => {
    if (!containerRef.current || index < 0 || index >= recipes.length) return;
    const container = containerRef.current;
    // We target the child container (the one with Container component)
    const recipeElement = container.children[index]; 
    if (recipeElement) {
      recipeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keyboard navigation (ArrowUp/ArrowDown)
  const handleKeyDown = useCallback(
    (e) => {
      e.preventDefault(); // Prevent the whole page from scrolling
      if (e.key === 'ArrowDown') {
        setCurrentIndex((prev) => {
          const nextIndex = Math.min(prev + 1, recipes.length - 1);
          scrollToRecipe(nextIndex);
          return nextIndex;
        });
      } else if (e.key === 'ArrowUp') {
        setCurrentIndex((prev) => {
          const prevIndex = Math.max(prev - 1, 0);
          scrollToRecipe(prevIndex);
          return prevIndex;
        });
      }
    },
    [recipes.length] // Dependency on recipes.length
  );

  // Attach/Remove keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: 'calc(100vh - 64px)', // Full height minus navbar
        width: '100%',
        overflowY: 'scroll', // Allow scrolling
        scrollSnapType: 'y mandatory', // Snap to each reel
        bgcolor: '#f4f6f8',
        // Hide scrollbar
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none' // Firefox
      }}
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', scrollSnapAlign: 'start' }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Box sx={{ p: 2, height: '100%', scrollSnapAlign: 'start' }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        </Box>
      )}

      {!loading && !error && recipes.length > 0 && (
        recipes.map((recipe, index) => (
          // This Container centers and narrows the reel
          <Container
            key={recipe.id}
            maxWidth="sm" // This creates the narrow feed (e.g., ~600px)
            sx={{
              scrollSnapAlign: 'start',
              height: 'calc(100vh - 64px)',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              p: 0, // No padding on the container itself
            }}
          >
            <Box sx={{ width: '100%', height: '100%' }}>
              <RecipeReel 
                recipe={recipe} 
                isFirst={index === 0}
                isLast={index === recipes.length - 1}
                onScroll={scrollToRecipe} // Pass the scroll function
                index={index} // Pass the current index
              />
            </Box>
          </Container>
        ))
      )}
    </Box>
  );
};

export default ReelsFeed;

