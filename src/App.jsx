/**
 * App.jsx - Main Application Component
 * 
 * This is the root component that handles routing and authentication flow.
 * It uses React Router for navigation and Redux for authentication state management.
 * 
 * Features:
 * - Protected routes that require authentication
 * - Auto-redirect for authenticated users trying to access login/signup
 * - Fallback route handling for unknown paths
 * 
 * @author Sarthak Gupta
 * @version 1.0.0
 */

import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'
import PrivateRoute from './components/PrivateRoute'

/**
 * Main App Component
 * 
 * Handles the application's routing logic based on authentication state.
 * Uses Redux to check if user is authenticated and renders appropriate components.
 * 
 * @returns {JSX.Element} The main app component with routing
 */
function App() {
  // Get authentication state from Redux store
  // This will be true if user is logged in, false otherwise
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Routes>
      {/* 
        Login Route
        - If user is already authenticated, redirect to home page
        - Otherwise, show login component
      */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />
      
      {/* 
        Sign Up Route
        - If user is already authenticated, redirect to home page
        - Otherwise, show signup component
      */}
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} 
      />
      
      {/* 
        Home Route (Protected)
        - Wrapped in PrivateRoute component to ensure authentication
        - Only authenticated users can access this route
        - Contains the main todo application
      */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      
      {/* 
        Catch-all Route
        - Redirects any unknown routes to home page
        - Home page will handle authentication check via PrivateRoute
      */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
