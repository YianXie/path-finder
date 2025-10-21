import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import "./index.css";

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
