import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContestProvider } from './context/ContestContext';
import { AntiCheatProvider } from './context/AntiCheatContext';

// Lazy dynamic imports - bypasses browser ESM cache stale module issues
const HomePage            = lazy(() => import('./pages/HomePage'));
const LoginPage           = lazy(() => import('./pages/LoginPage'));
const RegisterPage        = lazy(() => import('./pages/RegisterPage'));
const InstructionsPage    = lazy(() => import('./pages/InstructionsPage'));
const ContestPage         = lazy(() => import('./pages/ContestPage'));
const LeaderboardPage     = lazy(() => import('./pages/LeaderboardPage'));
const ResultPage          = lazy(() => import('./pages/ResultPage'));
const AdminDashboardPage  = lazy(() => import('./pages/AdminDashboardPage'));
const AdminQuestionsPage  = lazy(() => import('./pages/AdminQuestionsPage'));
const AdminMonitoringPage = lazy(() => import('./pages/AdminMonitoringPage'));
const AdminPanelPage      = lazy(() => import('./pages/AdminPanelPage'));

// Loading fallback spinner
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#07090e]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      <p className="text-xs text-slate-400 font-mono tracking-wider">Loading CODE DEBUGGING...</p>
    </div>
  </div>
);

// Protected Route Guard for Participants
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Guard for Admin
const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <ContestProvider>
        <AntiCheatProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0c1017',
                  color: '#f1f5f9',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/"           element={<HomePage />} />
                <Route path="/login"      element={<LoginPage />} />
                <Route path="/register"   element={<RegisterPage />} />

                <Route path="/instructions" element={<RequireAuth><InstructionsPage /></RequireAuth>} />
                <Route path="/contest"      element={<RequireAuth><ContestPage /></RequireAuth>} />
                <Route path="/leaderboard"  element={<LeaderboardPage />} />
                <Route path="/result"       element={<RequireAuth><ResultPage /></RequireAuth>} />

                {/* Admin Routes */}
                <Route path="/admin"            element={<RequireAdmin><AdminPanelPage /></RequireAdmin>} />
                <Route path="/admin/dashboard"  element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
                <Route path="/admin/questions"  element={<RequireAdmin><AdminQuestionsPage /></RequireAdmin>} />
                <Route path="/admin/monitoring" element={<RequireAdmin><AdminMonitoringPage /></RequireAdmin>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AntiCheatProvider>
      </ContestProvider>
    </AuthProvider>
  );
}

export default App;
