import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return <div className="min-h-screen bg-charcoal" />;
  }
  if (!user) {
    return <Navigate to="/backoffice/login" replace />;
  }
  return children;
}
