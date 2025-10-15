import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { setSnackBar } = useSnackBar();

    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    const { data } = await api.post("auth/google/", {
                        credential: response.credential,
                    });
                    login(data.tokens, data.user);
                    setSnackBar({
                        open: true,
                        message: "Logged in successfully",
                    });
                    navigate("/");
                },
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin"),
                { theme: "outline", size: "large" }
            );
        }
    }, [login, navigate]);

    return <div id="google-signin" />;
}
