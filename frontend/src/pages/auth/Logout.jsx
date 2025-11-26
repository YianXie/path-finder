import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";

/**
 * Logout page component - User logout handler
 *
 * Handles user logout by calling the logout function from AuthContext.
 * Shows success notification and redirects to home page.
 * This component executes logout logic immediately on mount.
 */
function Logout() {
    const { logout } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();
    logout();
    setSnackBar({
        ...snackBar,
        open: true,
        severity: "success",
        message: "Logged out successfully",
    });

    return <Navigate to="/" />;
}

export default Logout;
