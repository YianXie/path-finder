import { useCallback } from "react";

import { useSnackBar } from "../contexts/SnackBarContext";

function useApiError() {
    const { setSnackBar } = useSnackBar();

    const handleError = useCallback(
        (error, defaultMessage = "An error occurred") => {
            console.error(defaultMessage, error);
            setSnackBar((prev) => ({
                ...prev,
                open: true,
                severity: "error",
                message: error?.message || defaultMessage,
            }));
        },
        [setSnackBar]
    );

    const handleSuccess = useCallback(
        (message) => {
            setSnackBar((prev) => ({
                ...prev,
                open: true,
                severity: "success",
                message,
            }));
        },
        [setSnackBar]
    );

    return { handleError, handleSuccess };
}

export default useApiError;
