// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './store/slices/authSlice';
import Layout from './components/common/Layout';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProblemList from './components/problems/ProblemList';
import ProblemDetail from './components/problems/ProblemDetail';
import CreateProblem from './components/problems/CreateProblem';
import MyProblems from './components/problems/MyProblems'; // Import the new component

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  
  // Verify token on app load and page refresh
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });
          
          const data = await response.json();
          
          if (data.success) {
            dispatch(loginSuccess({
              user: data.user,
              token: token,
            }));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          dispatch(logout());
        }
      }
    };
    
    verifyToken();
  }, [dispatch, token]);
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          {/* Protected routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/problems" replace />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route 
              path="/create-problem" 
              element={
                <ProtectedRoute>
                  <CreateProblem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-problems" 
              element={
                <ProtectedRoute>
                  <MyProblems />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/problems" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;