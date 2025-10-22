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

export const SnackBarProvider = ({ children }) => {
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity: "info",
        message: "",
        duration: 3000,
        action: null,
    });

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
                autoHideDuration={snackBar.duration}
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

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackBar = () => useContext(SnackBarContext);
