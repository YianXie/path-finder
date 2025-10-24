import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

/**
 * ProtectedRoute component for authentication-based route protection
 *
 * Wraps components that require authentication. Shows loading spinner while
 * checking authentication status, then either renders children or redirects to login.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 */
function ProtectedRoute({ children }) {
    const { access } = useAuth();

    // Show loading spinner if access is null
    if (access === null) {
        return <CircularProgress />;
    }

    // Only render children if access is present
    return access ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
