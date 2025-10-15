import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <SnackBarProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </SnackBarProvider>
        </AuthProvider>
    </StrictMode>
);
