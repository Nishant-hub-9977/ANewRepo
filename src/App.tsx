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

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Layout>
                <Portfolio />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/strategies" element={
            <ProtectedRoute>
              <Layout>
                <Strategies />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/strategies/:id" element={
            <ProtectedRoute>
              <Layout>
                <StrategyDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/backtests" element={
            <ProtectedRoute>
              <Layout>
                <Backtests />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/backtests/:id" element={
            <ProtectedRoute>
              <Layout>
                <BacktestDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/market" element={
            <ProtectedRoute>
              <Layout>
                <Market />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;