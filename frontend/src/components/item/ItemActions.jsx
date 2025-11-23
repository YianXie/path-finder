import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useItemDetail } from "../../contexts/ItemDetailContext";
import { useItemActions } from "../../hooks";

export function ItemActions() {
    const { access } = useAuth();
    const { state, setters } = useItemDetail();
    const { handleShare, handleSave, handleExternalLink } = useItemActions();
    const { external_id } = useParams();

    /**
     * Handles saving/unsaving the item with optimistic UI design
     */
    const onSave = async () => {
        // I change the UI before I send the requests
        setters.setIsSaved(!state.isSaved);
        try {
            // If the requests succeeds than nothing happens
            await handleSave(external_id, state.isSaved, () => {});
        } catch {
            // But if it fails we toggle back the current value to make sure we have the correct value
            setters.setIsSaved((prev) => !prev);
        }
    };

    /**
     * Handles sharing the current page URL
     */
    const onShare = async () => {
        await handleShare(window.location.href);
    };

    /**
     * Opens the external link in a new tab
     */
    const onExternalLink = () => {
        if (state.itemInfo?.url) {
            handleExternalLink(state.itemInfo.url);
        }
    };

    useEffect(() => {
        console.log(state);
    }, [state]);

    return (
        <Stack direction="row" spacing={1}>
            {/* Save Button */}
            {/* Show Item actions buttons if logged in */}
            {access && (
                <Tooltip
                    title={state.isSaved ? "Remove from saved" : "Save item"}
                    placement="bottom"
                >
                    <IconButton
                        onClick={onSave}
                        color="primary"
                        aria-label={
                            state.isSaved ? "Remove from saved" : "Save item"
                        }
                    >
                        {state.isSaved ? (
                            <FavoriteIcon />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </IconButton>
                </Tooltip>
            )}

            {/* Share Button */}
            <Tooltip title="Share" placement="bottom">
                <IconButton
                    onClick={onShare}
                    color="primary"
                    aria-label="Share"
                >
                    <ShareIcon />
                </IconButton>
            </Tooltip>

            {/* External Link Button */}
            {state.itemInfo?.url && (
                <Tooltip title="Visit Website" placement="bottom">
                    <IconButton
                        onClick={onExternalLink}
                        color="primary"
                        aria-label="Visit Website"
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}
