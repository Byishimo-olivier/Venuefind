import { Navigate } from 'react-router-dom';
import { getAuthUser } from '../services/api';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = getAuthUser();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not in allowed roles, redirect to venues
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/venues" replace />;
  }

  return <>{children}</>;
}
