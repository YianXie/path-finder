import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "./components/layout/Layout";
import Clubs from "./pages/Clubs";
import Competitions from "./pages/Competitions";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import OnBoarding from "./pages/OnBoarding";
import Tutoring from "./pages/Tutoring";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Saved from "./pages/auth/Saved";

function App() {
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
                    <Route
                        path="/onboarding"
                        element={
                            // <ProtectedRoute>
                            <OnBoarding />
                            // </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/logout"
                        element={
                            <ProtectedRoute>
                                <Logout />
                            </ProtectedRoute>
                        }
                    />
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
