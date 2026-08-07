import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ColorModeProvider } from './context/ColorModeContext';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { AppsKeysPage } from './pages/AppsKeysPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { LogsPage } from './pages/LogsPage';
import { SecurityPage } from './pages/SecurityPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { WebhooksPage } from './pages/WebhooksPage';
import './i18n/i18n';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="playground" element={<PlaygroundPage />} />
              <Route path="apps" element={<AppsKeysPage />} />
              <Route path="whatsapp" element={<WhatsAppPage />} />
              <Route path="webhooks" element={<WebhooksPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ColorModeProvider>
  );
};
