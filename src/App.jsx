import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import AdminPanel from './pages/AdminPanel';
import SocialMediaTool from './pages/modules/SocialMediaTool';
import SEOTool from './pages/modules/SEOTool';
import GoogleAdsTool from './pages/modules/GoogleAdsTool';
import DesignBriefTool from './pages/modules/DesignBriefTool';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><Spinner size="lg" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><Spinner size="lg" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
    <Route path="/tools/social-media" element={<PrivateRoute><SocialMediaTool /></PrivateRoute>} />
    <Route path="/tools/seo" element={<PrivateRoute><SEOTool /></PrivateRoute>} />
    <Route path="/tools/google-ads" element={<PrivateRoute><GoogleAdsTool /></PrivateRoute>} />
    <Route path="/tools/design-brief" element={<PrivateRoute><DesignBriefTool /></PrivateRoute>} />
    <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
