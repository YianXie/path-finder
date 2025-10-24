import { useCallback } from "react";

import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import useApiError from "./useApiError";

/**
 * Custom hook for item-related actions (save/unsave, share)
 *
 * Provides functions to handle saving/unsaving items and sharing functionality.
 * Integrates with authentication context to ensure user is logged in for save operations.
 *
 * @returns {Object} Object containing item action handlers
 * @returns {Function} returns.handleSave - Function to save/unsave an item
 * @returns {Function} returns.handleShare - Function to share an item via clipboard
 */
function useItemActions() {
    const { access } = useAuth();
    const { handleError, handleSuccess } = useApiError();

    /**
     * Saves or unsaves an item to/from user's profile
     * @param {string} externalId - The external ID of the item to save/unsave
     * @param {boolean} isSaved - Current saved state of the item
     * @param {Function} onSuccess - Callback function to execute on successful save/unsave
     */
    const handleSave = useCallback(
        async (externalId, isSaved, onSuccess) => {
            if (!access) {
                handleError(null, "Please login to save items");
                return;
            }

            try {
                await api.post("/accounts/save-item/", {
                    external_id: externalId,
                });

                handleSuccess(
                    `Item ${isSaved ? "removed from" : "saved to"} your profile`
                );

                if (onSuccess) {
                    onSuccess();
                }
            } catch (error) {
                handleError(error, "Failed to save item to your profile");
            }
        },
        [access, handleError, handleSuccess]
    );

    /**
     * Copies a URL to the clipboard for sharing
     * @param {string} url - URL to copy (defaults to current page URL)
     */
    const handleShare = useCallback(
        async (url = window.location.href) => {
            try {
                await navigator.clipboard.writeText(url);
                handleSuccess("Link copied to clipboard");
            } catch (error) {
                handleError(error, "Failed to copy link to clipboard");
            }
        },
        [handleError, handleSuccess]
    );

    return { handleSave, handleShare };
}

export default useItemActions;
