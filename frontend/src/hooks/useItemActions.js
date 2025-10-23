import { useCallback } from "react";

import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import useApiError from "./useApiError";

function useItemActions() {
    const { access } = useAuth();
    const { handleError, handleSuccess } = useApiError();

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
