import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import Clubs from "./pages/Clubs";
import Tutoring from "./pages/Tutoring";
import Profile from "./pages/Profile";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/competitions"
                                element={<Competitions />}
                            />
                            <Route path="/clubs" element={<Clubs />} />
                            <Route path="/tutoring" element={<Tutoring />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
