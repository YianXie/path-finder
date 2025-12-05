import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";

/**
 * GoogleButton component for Google Sign-In authentication
 *
 * Initializes Google Sign-In button using Google Identity Services.
 * Handles OAuth callback, sends credential to backend for authentication,
 * and manages login state and navigation after successful authentication.
 * Redirects to onboarding if user hasn't completed it, otherwise to home page.
 */
export default function GoogleButton() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();

    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    try {
                        const { data } = await api.post("accounts/google/", {
                            credential: response.credential,
                        });
                        await login(data.tokens, data.user); // ensure login is complete before redirecting
                        console.log(data);
                        setSnackBar({
                            ...snackBar,
                            open: true,
                            severity: "success",
                            message: "Logged in successfully",
                        });
                        data.user.finished_onboarding
                            ? navigate("/")
                            : navigate("/onboarding");
                    } catch (error) {
                        setSnackBar({
                            ...snackBar,
                            open: true,
                            message: error.response.data.detail,
                            severity: "error",
                        });
                    }
                },
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin"),
                { theme: "outline", size: "large" }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login]);

    return <div id="google-signin" />;
}
