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
import { ItemDetailProvider } from "./contexts/ItemDetailContext";
import About from "./pages/About";
import Compare from "./pages/Compare";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";

/**
 * Main App component that sets up routing and layout
 *
 * Defines all application routes with lazy-loaded components for better performance.
 * Uses ProtectedRoute for authenticated pages and Layout for consistent page structure.
 */
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            <>
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            </>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <ProtectedRoute>
                                <About />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        }
                    />
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
                            <ProtectedRoute>
                                <ItemDetailProvider>
                                    <LazyItemDetail />
                                </ItemDetailProvider>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/compare"
                        element={
                            <ProtectedRoute>
                                <Compare />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<LazyNotFoundPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
