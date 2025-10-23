import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import {
    LazyClubs,
    LazyCompetitions,
    LazyItemDetail,
    LazyNotFoundPage,
    LazyOnBoarding,
    LazySaved,
    LazyTutoring,
} from "./components/LazyWrapper";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";

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
                                <LazySaved />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute>
                                <LazyOnBoarding />
                            </ProtectedRoute>
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
                                <LazyCompetitions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clubs"
                        element={
                            <ProtectedRoute>
                                <LazyClubs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tutoring"
                        element={
                            <ProtectedRoute>
                                <LazyTutoring />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/item/:external_id"
                        element={<LazyItemDetail />}
                    />
                    <Route path="*" element={<LazyNotFoundPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
