import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  Tooltip, 
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  AccountCircle, 
  AdminPanelSettings,
  Person,
  Logout,
  Login,
  AppRegistration,
  Restaurant,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Authentication and role logic
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && userRole === 'ROLE_ADMIN';
  const isCookOrAdmin = isLoggedIn && (userRole === 'ROLE_COOK' || userRole === 'ROLE_ADMIN');

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    handleClose();
    setMobileMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!username) return 'U';
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: 'white',
        color: 'black',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ py: 1, px: { xs: 2, sm: 4 } }}>
        {/* Brand / Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: 1,
          }}
        >
          <Restaurant sx={{ fontSize: 30, color: '#1565c0' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 0.5,
            }}
          >
            Recipe Platform
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Nav Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 0,
                  height: 2,
                  bgcolor: '#1976d2',
                  transition: 'width 0.3s ease',
                },
                '&:hover:after': { width: '100%' },
              }}
            >
              Home
            </Button>

            {isCookOrAdmin && (
              <Button
                color="inherit"
                component={Link}
                to="/create-recipe"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 0,
                    height: 2,
                    bgcolor: '#1976d2',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover:after': { width: '100%' },
                }}
              >
                Create Recipe
              </Button>
            )}

            {/* Login / Account Button */}
            {isLoggedIn ? (
              <Tooltip title="Account" arrow>
                <IconButton onClick={handleMenu}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#1976d2',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 5,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Login
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton onClick={toggleMobileMenu}>
            <MenuIcon sx={{ fontSize: 30, color: '#1565c0' }} />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu Drawer */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            backgroundColor: 'white',
            px: 2,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            component={Link}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              justifyContent: 'flex-start',
              color: '#1976d2',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Home
          </Button>
          {isCookOrAdmin && (
            <Button
              component={Link}
              to="/create-recipe"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                justifyContent: 'flex-start',
                color: '#1976d2',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Create Recipe
            </Button>
          )}
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Button
                  onClick={() => handleMenuClick('/admin')}
                  sx={{ justifyContent: 'flex-start', color: '#1565c0' }}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                onClick={() => handleMenuClick('/profile')}
                sx={{ justifyContent: 'flex-start', color: '#1565c0' }}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#d32f2f',
                  fontWeight: 600,
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#1565c0',
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#1565c0',
                  fontWeight: 600,
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      )}

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            overflow: 'visible',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        {isLoggedIn ? (
          <>
            <MenuItem >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  bgcolor: '#1976d2',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    cursor: 'default',
                  },
                }}
              >
                {getUserInitials()}
              </Avatar>
              <ListItemText
                primary={
                  <Typography fontWeight={600}>{username || 'User'}</Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      opacity: 1, // ✅ Forces full visibility
                    }}
                  >
                    {userRole === 'ROLE_ADMIN'
                      ? 'Administrator'
                      : userRole === 'ROLE_COOK'
                      ? 'Cook'
                      : 'User'}
                  </Typography>
                }
              />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            {isAdmin && (
              <MenuItem onClick={() => handleMenuClick('/admin')}>
                <ListItemIcon>
                  <AdminPanelSettings fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </MenuItem>
            )}
            <MenuItem onClick={() => handleMenuClick('/profile')}>
              <ListItemIcon>
                <Person fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography color="error" fontWeight={600}>
                    Logout
                  </Typography>
                }
              />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleMenuClick('/login')}>
              <ListItemIcon>
                <Login fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/register')}>
              <ListItemIcon>
                <AppRegistration fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
