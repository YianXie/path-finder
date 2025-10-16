import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, redirectTo = "/login" }) {
    const { isAuthenticated } = useAuth();
    const { setSnackBar } = useSnackBar();
    if (!isAuthenticated) {
        setSnackBar({
            open: true,
            severity: "warning",
            message: "Please login to access this page",
        });
        return <Navigate to={redirectTo} />;
    }

    return children;
}

export default ProtectedRoute;
