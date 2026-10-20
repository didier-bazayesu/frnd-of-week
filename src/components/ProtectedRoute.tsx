import { Navigate, Outlet } from 'react-router-dom';
import { STORAGE_KEYS } from '../config/admin';

/**
 * Wraps admin routes. Redirects to /admin/login when no valid demo session exists.
 *
 * NOTE: This is frontend-only protection. It can be bypassed by manually setting
 * the sessionStorage key. Do not rely on it for real security.
 */
export default function ProtectedRoute() {
  const isAuthenticated = sessionStorage.getItem(STORAGE_KEYS.adminSession) === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
