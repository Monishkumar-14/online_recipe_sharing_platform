import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  Alert,
  Box,
  Chip,
  Avatar,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get the current user's ID from localStorage to prevent self-deletion
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(parseInt(userId, 10));
    }
  }, []);

  // Fetch all users from the new backend endpoint
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. You may not have permission.');
      console.error(err);
    }
  }, []);

  // Run the fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle the delete user button click
  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action is permanent.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Remove the user from the table in the UI
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  // Get role-specific styling
  const getRoleChip = (role) => {
    const roleConfig = {
      ADMIN: { color: 'error', icon: <AdminIcon sx={{ fontSize: 16 }} /> },
      COOK: { color: 'success', icon: <RestaurantIcon sx={{ fontSize: 16 }} /> },
      USER: { color: 'primary', icon: <PersonIcon sx={{ fontSize: 16 }} /> }
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    
    return (
      <Chip 
        label={role} 
        color={config.color}
        icon={config.icon}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Get user avatar
  const getUserAvatar = (username) => {
    return (
      <Avatar 
        sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: '#1976d2',
          fontSize: '0.875rem',
          fontWeight: 600
        }}
      >
        {username.substring(0, 2).toUpperCase()}
      </Avatar>
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 3,
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#f5f5f5',
                mr: 2,
                border: '2px solid #e0e0e0'
              }}
            >
              <AdminIcon sx={{ fontSize: 32, color: '#757575' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight={700}
                color="text.primary"
              >
                Admin Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage all registered users and their accounts
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mt: 2, borderRadius: 1 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
        </Paper>

        {/* Users Table */}
        <TableContainer 
          component={Paper} 
          elevation={3}
          sx={{ borderRadius: 2 }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              All Users ({users.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage user accounts
            </Typography>
          </Box>
          
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Role
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#fafafa' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        #{user.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getUserAvatar(user.username)}
                        <RouterLink 
                          to={`/admin/user/${user.id}/recipes`}
                          style={{
                            textDecoration: 'none',
                            color: '#1976d2',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {user.username}
                        </RouterLink>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getRoleChip(user.role)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip 
                        title={user.id === currentUserId ? "Cannot delete your own account" : "Delete user"}
                      >
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUserId}
                            aria-label="delete user"
                            sx={{
                              '&:hover': {
                                bgcolor: 'rgba(211, 47, 47, 0.08)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default AdminDashboard;