import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/modules/spare-parts/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import ModuleHeader from '@/components/ModuleHeader';
import Dashboard from './Dashboard';
import Login from './Login';
import Categories from './Categories';
import Parts from './Parts';
import Sales from './Sales';
import Invoices from './Invoices';
import Reports from './Reports';
import SettingsPage from './Settings';
import AdminPanel from './AdminPanel';
import Contact from './Contact';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/module/spare-parts/login" replace />;
  return <>{children}</>;
};

const SparePartsPage: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ModuleHeader title="Yedek Parça Hub" />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="parts" element={<ProtectedRoute><Parts /></ProtectedRoute>} />
          <Route path="sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default SparePartsPage;
