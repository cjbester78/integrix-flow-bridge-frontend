import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const roleRouteAccess = {
  '/dashboard': ['admin', 'integrator', 'viewer'],
  '/create-flow': ['admin', 'integrator'],
  '/data-structures': ['admin', 'integrator'],
  '/create-communication-adapter': ['admin', 'integrator'],
  '/messages': ['admin', 'integrator', 'viewer'],
  '/channels': ['admin', 'integrator', 'viewer'],
  '/admin': ['admin'],
  '/settings': ['admin']
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (user) {
    const allowedRoles = requiredRoles || roleRouteAccess[location.pathname as keyof typeof roleRouteAccess];
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to dashboard if user doesn't have access to the current route
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};