import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import Clubs from "./pages/Clubs";
import Tutoring from "./pages/Tutoring";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Profile from "./pages/auth/Profile";
import ItemDetail from "./pages/ItemDetail";
import ProtectedRoute from "./components/global/ProtectedRoute";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/competitions" element={<Competitions />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/tutoring" element={<Tutoring />} />
                    <Route path="/item/:id" element={<ItemDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
