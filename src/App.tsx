import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MatchPage from './pages/MatchPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:participantId" element={<MatchPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}