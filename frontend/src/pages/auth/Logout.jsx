import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useSnackBar } from "../../contexts/SnackBarContext";

function Logout() {
    const { logout } = useAuth();
    const { setSnackBar } = useSnackBar();
    logout();
    setSnackBar({
        open: true,
        severity: "success",
        message: "Logged out successfully",
    });

    return <Navigate to="/" />;
}

export default Logout;
