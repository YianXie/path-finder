import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [access, setAccess] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if token is expired
    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch {
            return true; // If we can't parse the token, consider it expired
        }
    };

    // Function to refresh access token using refresh token
    const refreshToken = useCallback(async (refreshTokenValue) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh: refreshTokenValue }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const newAccessToken = data.access;

                // Update stored tokens
                localStorage.setItem("access", newAccessToken);
                setAccess(newAccessToken);

                // Extract user info from new token
                const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
                setUser({ email: payload.email, name: payload.name });
            } else {
                logout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
        }
    }, []);

    // Initialize auth state from localStorage on app startup
    useEffect(() => {
        const initializeAuth = () => {
            const storedAccess = localStorage.getItem("access");
            const storedRefresh = localStorage.getItem("refresh");

            if (storedAccess && storedRefresh) {
                // Check if access token is still valid
                if (!isTokenExpired(storedAccess)) {
                    try {
                        const payload = JSON.parse(
                            atob(storedAccess.split(".")[1])
                        );
                        setAccess(storedAccess);
                        setRefresh(storedRefresh);
                        setUser({ email: payload.email, name: payload.name });
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
            setIsLoading(false);
        };

        initializeAuth();
    }, [refreshToken]);

    useEffect(() => {
        if (access) {
            const payload = JSON.parse(atob(access.split(".")[1]));
            setUser({ email: payload.email, name: payload.name });
        }
    }, [access]);

    const login = (tokens, userData) => {
        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        setAccess(tokens.access);
        setRefresh(tokens.refresh);
        setUser(userData);
    };

    const logout = () => {
        try {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            setAccess(null);
            setRefresh(null);
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Function to get a valid access token (refreshes if needed)
    const getValidAccessToken = async () => {
        const currentAccess = localStorage.getItem("access");

        if (!currentAccess) {
            return null;
        }

        // Check if token expires in the next 5 minutes
        const payload = JSON.parse(atob(currentAccess.split(".")[1]));
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
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                access,
                refresh,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading,
                getValidAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
