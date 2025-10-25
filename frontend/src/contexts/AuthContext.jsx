import { jwtDecode } from "jwt-decode";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../api";

// Create context for authentication
const AuthContext = createContext();

/**
 * Authentication context provider
 *
 * Manages user authentication state including tokens, user data, and authentication methods.
 * Handles JWT token validation, refresh logic, and automatic token renewal.
 * Provides login, logout, and token management functionality to child components.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [access, setAccess] = useState(null);
    const [refresh, setRefresh] = useState(null);

    /**
     * Checks if a JWT token is expired
     * @param {string} token - The JWT token to check
     * @returns {boolean} True if token is expired or invalid, false otherwise
     */
    const isTokenExpired = (token) => {
        try {
            const payload = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch {
            return true; // If we can't parse the token, consider it expired
        }
    };

    /**
     * Fetches user profile data from the backend
     * @param {string} accessToken - The access token for authentication
     */
    const fetchUserProfile = useCallback(async (accessToken) => {
        try {
            const response = await api.get("/accounts/profile/", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                const userData = response.data;
                setUser({
                    email: userData.email,
                    name: userData.name,
                    finished_onboarding: userData.finished_onboarding,
                });
            } else {
                console.error("Failed to fetch user profile:", response.status);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, []);

    /**
     * Logs out the current user and clears all stored data
     */
    const logout = useCallback(() => {
        try {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setAccess(null);
            setRefresh(null);
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }, []);

    /**
     * Refreshes the access token using the refresh token
     * @param {string} refreshTokenValue - The refresh token to use for renewal
     */
    const refreshToken = useCallback(
        async (refreshTokenValue) => {
            try {
                const response = await api.post("/api/token/refresh/", {
                    refresh: refreshTokenValue,
                });

                if (response.status === 200) {
                    const data = response.data;
                    const newAccessToken = data.access;

                    // Update stored tokens
                    localStorage.setItem("access", newAccessToken);
                    setAccess(newAccessToken);

                    // Extract user info from new token
                    const payload = jwtDecode(newAccessToken);

                    // Check if email and name are in the token, otherwise keep existing user data
                    if (payload.email && payload.name) {
                        setUser({ email: payload.email, name: payload.name });
                    } else {
                        console.warn(
                            "Email or name not found in refreshed token payload"
                        );
                    }
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                logout();
            }
        },
        [logout]
    );

    /**
     * Initialize authentication state from localStorage on app startup
     * Checks for valid tokens and refreshes if needed
     */
    useEffect(() => {
        const initializeAuth = () => {
            const storedAccess = localStorage.getItem("access");
            const storedRefresh = localStorage.getItem("refresh");

            if (storedAccess && storedRefresh) {
                // Check if access token is still valid
                if (!isTokenExpired(storedAccess)) {
                    try {
                        const payload = jwtDecode(storedAccess);
                        setAccess(storedAccess);
                        setRefresh(storedRefresh);

                        // Check if email and name are in the token
                        if (payload.email && payload.name) {
                            setUser({
                                email: payload.email,
                                name: payload.name,
                            });
                        } else {
                            console.warn(
                                "Email or name not found in stored token payload"
                            );
                            // Try to get user data from the backend if not in token
                            // This is a fallback for existing tokens without custom claims
                            fetchUserProfile(storedAccess);
                        }
                    } catch (error) {
                        console.error("Error parsing stored token:", error);
                        // Clear invalid tokens
                        localStorage.removeItem("access");
                        localStorage.removeItem("refresh");
                    }
                } else {
                    // Access token expired, try to refresh
                    refreshToken(storedRefresh);
                }
            }
        };

        initializeAuth();
    }, [refreshToken, fetchUserProfile]);

    useEffect(() => {
        if (access) {
            try {
                const payload = jwtDecode(access);

                // Only update user if email and name are present in the token
                if (payload.email && payload.name) {
                    setUser({ email: payload.email, name: payload.name });
                } else {
                    console.warn(
                        "Email or name not found in access token payload"
                    );
                }
            } catch (error) {
                console.error("Error decoding access token:", error);
            }
        }
    }, [access]);

    /**
     * Logs in a user with tokens and user data
     * @param {Object} tokens - Object containing access and refresh tokens
     * @param {Object} userData - User information (email, name, etc.)
     * @returns {Promise} Promise that resolves when login is complete
     */
    const login = useCallback((tokens, userData) => {
        return new Promise((resolve) => {
            localStorage.setItem("access", tokens.access);
            localStorage.setItem("refresh", tokens.refresh);
            setAccess(tokens.access);
            setRefresh(tokens.refresh);
            setUser(userData);

            // Use setTimeout to ensure state updates are processed
            // TODO: this is not a good solution, we should use a better way to ensure state updates are processed
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }, []);

    /**
     * Gets a valid access token, refreshing if it expires within 5 minutes
     * @returns {Promise<string|null>} Valid access token or null if refresh fails
     */
    const getValidAccessToken = useCallback(async () => {
        const currentAccess = localStorage.getItem("access");

        if (!currentAccess) {
            return null;
        }

        // Check if token expires in the next 5 minutes
        const payload = jwtDecode(currentAccess);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        if (timeUntilExpiry < 300) {
            // Less than 5 minutes
            const refreshTokenValue = localStorage.getItem("refresh");
            if (refreshTokenValue) {
                await refreshToken(refreshTokenValue);
                return localStorage.getItem("access");
            } else {
                logout();
                return null;
            }
        }

        return currentAccess;
    }, [refreshToken, logout]);

    const contextValue = useMemo(
        () => ({
            user,
            access,
            refresh,
            login,
            logout,
            getValidAccessToken,
        }),
        [user, access, refresh, login, logout, getValidAccessToken]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context value
 * @returns {Object|null} returns.user - Current user data
 * @returns {string|null} returns.access - Current access token
 * @returns {string|null} returns.refresh - Current refresh token
 * @returns {Function} returns.login - Function to log in a user
 * @returns {Function} returns.logout - Function to log out current user
 * @returns {Function} returns.getValidAccessToken - Function to get valid access token
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
