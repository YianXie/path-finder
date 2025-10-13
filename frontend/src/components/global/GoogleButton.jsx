import api from "../../api";
import { useEffect } from "react";

export default function GoogleButton() {
    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    const res = await api.post("auth/google/", {
                        credential: response.credential,
                    });
                    const data = await res.json();
                    localStorage.setItem("access", data.tokens.access);
                    localStorage.setItem("refresh", data.tokens.refresh);
                },
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin"),
                { theme: "outline", size: "large" }
            );
        }
    }, []);

    return <div id="google-signin" />;
}
