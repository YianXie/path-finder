import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

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
