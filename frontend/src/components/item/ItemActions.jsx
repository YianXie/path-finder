import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { ItemDetailContext } from "../../contexts/ItemDetailContext";
import { useItemActions } from "../../hooks";

export function ItemActions() {
    const { access } = useAuth();
    const { state, setters } = useContext(ItemDetailContext);

    const { handleShare, handleSave } = useItemActions();

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
     * Handles User Rating changes with Optimistc UI design
     */
    // const onRating = async (e, newRating) => {
    //     // I change the UI before I send the requests
    //     setters.setRating(newRating);
    //     try {
    //         await handleRating(external_id, newRating, () => {});
    //     } catch {
    //         // But if it fails we toggle back the current value to make sure we have the correct value
    //         setters.setIsSaved((prev) => !prev);
    //     }
    // };

    /**
     * Opens the external link in a new tab
     */
    const handleExternalLink = () => {
        if (state.itemInfo?.url) {
            window.open(state.itemInfo.url, "_blank", "noopener,noreferrer");
        }
    };

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

            {/* External Link */}
            {state.itemInfo.url && (
                <Tooltip title="Open external link" placement="bottom">
                    <IconButton
                        onClick={handleExternalLink}
                        color="primary"
                        aria-label="Open external link"
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}
