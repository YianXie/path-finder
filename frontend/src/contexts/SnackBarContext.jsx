import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const SnackBarContext = createContext();

/**
 * Snackbar context provider for global notifications
 *
 * Manages snackbar state and provides functions to show success, error, info, and warning messages.
 * Uses Material-UI Snackbar and Alert components for consistent UI notifications.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const SnackBarProvider = ({ children }) => {
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity: "info",
        message: "",
        duration: undefined,
        action: null,
    });

    /**
     * Handles closing the snackbar
     * @param {Event} event - The close event
     * @param {string} reason - Reason for closing ('clickaway' is ignored)
     */
    const handleClose = useCallback((event, reason) => {
        if (reason === "clickaway") return;
        setSnackBar((prev) => ({ ...prev, open: false }));
    }, []);

    const contextValue = useMemo(
        () => ({
            snackBar,
            setSnackBar,
        }),
        [snackBar]
    );

    return (
        <SnackBarContext.Provider value={contextValue}>
            <Snackbar
                open={snackBar.open}
                onClose={handleClose}
                autoHideDuration={snackBar.duration || 3000}
            >
                <Alert
                    severity={snackBar.severity}
                    onClose={handleClose}
                    sx={{ width: "100%" }}
                >
                    {snackBar.message}
                    {snackBar.action}
                </Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
};

/**
 * Hook to access snackbar context
 * @returns {Object} Snackbar context value
 * @returns {Object} returns.snackBar - Current snackbar state
 * @returns {Function} returns.setSnackBar - Function to update snackbar state
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSnackBar = () => useContext(SnackBarContext);
