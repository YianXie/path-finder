import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "./components/layout/Layout";
import { useAuth } from "./contexts/AuthContext";
import Clubs from "./pages/Clubs";
import Competitions from "./pages/Competitions";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Tutoring from "./pages/Tutoring";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Saved from "./pages/auth/Saved";

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
