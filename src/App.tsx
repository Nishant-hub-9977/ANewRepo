import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Strategies from './pages/Strategies';
import StrategyDetail from './pages/StrategyDetail';
import Backtests from './pages/Backtests';
import BacktestDetail from './pages/BacktestDetail';
import Portfolio from './pages/Portfolio';
import Market from './pages/Market';

import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * ProtectedRoute
 * Blocks access to certain routes if the user is not authenticated.
 * Displays a spinner while checking auth status.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * App Component
 * Sets up routing structure for both public and protected routes.
 * Wraps the app with AuthProvider to make auth state available throughout.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🔓 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protected Routes - require authentication */}

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Portfolio */}
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Layout>
                  <Portfolio />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Strategies Listing */}
          <Route
            path="/strategies"
            element={
              <ProtectedRoute>
                <Layout>
                  <Strategies />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Strategy Details (Dynamic ID) */}
          <Route
            path="/strategies/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <StrategyDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Backtests Listing */}
          <Route
            path="/backtests"
            element={
              <ProtectedRoute>
                <Layout>
                  <Backtests />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Backtest Detail View (Dynamic ID) */}
          <Route
            path="/backtests/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <BacktestDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Market Page */}
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Layout>
                  <Market />
                </Layout>
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
