import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const roleRouteAccess = {
  '/dashboard': ['administrator', 'integrator', 'viewer'],
  '/create-flow': ['administrator', 'integrator'],
  '/data-structures': ['administrator', 'integrator'],
  '/create-communication-adapter': ['administrator', 'integrator'],
  '/messages': ['administrator', 'integrator', 'viewer'],
  '/channels': ['administrator', 'integrator', 'viewer'],
  '/admin': ['administrator'],
  '/settings': ['administrator']
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  // Temporarily bypass authentication for debugging
  console.log('ProtectedRoute: Bypassing authentication for debugging');
  return <>{children}</>;
};