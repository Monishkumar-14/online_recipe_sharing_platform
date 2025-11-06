import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminUserRecipes from './pages/AdminUserRecipes';
import ReelsFeed from './pages/ReelsFeed';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reels" element={<ReelsFeed />} />
            <Route element={<ProtectedRoute allowedRoles={['ROLE_COOK', 'ROLE_ADMIN']} />}>
              <Route path="/create-recipe" element={<CreateRecipe />} />
            </Route>
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
            </Route>  
            <Route element={<ProtectedRoute allowedRoles={['ROLE_COOK', 'ROLE_ADMIN']} />}>
            <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/edit-recipe/:id" element={<CreateRecipe />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/user/:userId/recipes" element={<AdminUserRecipes />} />
            </Route>        
        </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
