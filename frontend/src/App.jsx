import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Competitions from "./pages/Competitions";
import Clubs from "./pages/Clubs";
import Tutoring from "./pages/Tutoring";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Saved from "./pages/auth/Saved";
import ItemDetail from "./pages/ItemDetail";
import ProtectedRoute from "./ProtectedRoute";

// Material UI components
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <Backdrop
                open={isLoading}
                sx={(theme) => ({
                    zIndex: theme.zIndex.drawer + 1,
                    color: "#fff",
                })}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                        path="/saved"
                        element={
                            <ProtectedRoute>
                                <Saved />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route
                        path="/competitions"
                        element={
                            <ProtectedRoute>
                                <Competitions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clubs"
                        element={
                            <ProtectedRoute>
                                <Clubs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tutoring"
                        element={
                            <ProtectedRoute>
                                <Tutoring />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/item/:external_id" element={<ItemDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
