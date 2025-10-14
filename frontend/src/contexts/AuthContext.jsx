import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [access, setAccess] = useState(null);
    const [refresh, setRefresh] = useState(null);

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
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAccess(null);
        setRefresh(null);
        setUser(null);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
