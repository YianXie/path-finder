import { useCallback } from "react";

import { useSnackBar } from "../contexts/SnackBarContext";

/**
 * Custom hook for handling API errors and success messages
 *
 * Provides standardized error and success handling with snackbar notifications.
 * This hook centralizes error handling logic and provides consistent user feedback.
 *
 * @returns {Object} Object containing error and success handlers
 * @returns {Function} returns.handleError - Function to handle and display errors
 * @returns {Function} returns.handleSuccess - Function to display success messages
 */
function useApiError() {
    const { setSnackBar } = useSnackBar();

    /**
     * Handles API errors by logging them and showing error snackbar
     * @param {Error|null} error - The error object (can be null)
     * @param {string} defaultMessage - Fallback message if error has no message
     */
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

    /**
     * Shows success message in snackbar
     * @param {string} message - Success message to display
     */
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
