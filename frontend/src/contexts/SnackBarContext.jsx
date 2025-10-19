import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackBarContext = createContext();

export const SnackBarProvider = ({ children }) => {
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity: "info",
        message: "",
        duration: 3000,
        action: null,
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackBar({ ...snackBar, open: false });
    };

    return (
        <SnackBarContext.Provider value={{ snackBar, setSnackBar }}>
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
