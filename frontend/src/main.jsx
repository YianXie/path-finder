import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchActiveProvider } from "./contexts/SearchActiveContext";
import { SnackBarProvider } from "./contexts/SnackBarContext";
import "./index.css";

// Create Material-UI theme with dark mode as default
const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

// Render the app with all necessary providers
createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* Authentication context provider */}
        <AuthProvider>
            {/* Search active context provider */}
            <SearchActiveProvider>
                {/* Global snackbar notifications provider */}
                <SnackBarProvider>
                    {/* Material-UI theme provider */}
                    <ThemeProvider theme={theme}>
                        {/* Reset CSS and normalize styles */}
                        <CssBaseline />
                        {/* Main application component */}
                        <App />
                    </ThemeProvider>
                </SnackBarProvider>
            </SearchActiveProvider>
        </AuthProvider>
    </StrictMode>
);
