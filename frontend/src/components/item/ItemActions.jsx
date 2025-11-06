import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useContext } from "react";
import { useParams } from "react-router-dom";

import { ItemDetailContext } from "../../contexts/ItemDetailContext";
import { useItemActions } from "../../hooks";

export function ItemActions() {
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
     * Handles User Rating changes
     */

    const onRating = async (e, newRating) => {
        setters.setRating(newRating);
        // // To be implemented
        // if (1 + 1 == 3) {
        //     await handleRating(external_id, newRating, () => {
        //         setters.setRating(newRating);
        //     });
        // }
    };

    /**
     * Opens the external link in a new tab
     */
    const handleExternalLink = () => {
        if (state.itemInfo?.url) {
            window.open(state.itemInfo.url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
            {/* Save Button */}
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
                    {state.isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Tooltip>

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

            {/* Rating Bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Tooltip title="Rate this item" placement="bottom">
                    <Rating
                        name="simple-controlled"
                        value={state.rating}
                        onChange={onRating}
                    />
                </Tooltip>
            </Box>
        </Stack>
    );
}
