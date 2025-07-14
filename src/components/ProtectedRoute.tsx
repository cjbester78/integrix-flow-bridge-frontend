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
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  console.log('🛡️ ProtectedRoute Debug:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    userId: user?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary animate-pulse mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">IntegrixLab</p>
            <p className="text-muted-foreground">Verifying authentication...</p>
          </div>
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