import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import {
    LazyItemDetail,
    LazyNotFoundPage,
    LazyOnBoarding,
    LazySaved,
} from "./components/LazyWrapper";
import ProtectedRoute from "./components/global/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { ItemDetailProvider } from "./contexts/ItemDetailProvider";
import About from "./pages/About";
import Home from "./pages/Home";
import HomeRedesign from "./pages/HomeRedesign";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";

/**
 * Main App component that sets up routing and layout
 *
 * Defines all application routes with lazy-loaded components for better performance.
 * Uses ProtectedRoute for authenticated pages and Layout for consistent page structure.
 * Includes public routes (Home, Login) and protected routes (Saved, OnBoarding, etc.).
 */
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/home-redesign" element={<HomeRedesign />} />
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
                        path="/item/:external_id"
                        element={
                            <ItemDetailProvider>
                                <LazyItemDetail />
                            </ItemDetailProvider>
                        }
                    />
                    <Route path="*" element={<LazyNotFoundPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
