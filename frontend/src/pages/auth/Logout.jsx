import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";

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
