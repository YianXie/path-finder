import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useItemDetail } from "../../contexts/ItemDetailContext";
import { useItemActions } from "../../hooks";

export function ItemActions({ handleRateItem }) {
    const { isAuthenticated } = useAuth();
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            <Stack direction="row" spacing={1}>
                {/* Save Button */}
                {/* Show Item actions buttons if logged in */}
                {isAuthenticated && (
                    <Tooltip
                        title={
                            state.isSaved ? "Remove from saved" : "Save item"
                        }
                        placement="bottom"
                    >
                        <IconButton
                            onClick={onSave}
                            color="primary"
                            aria-label={
                                state.isSaved
                                    ? "Remove from saved"
                                    : "Save item"
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
            {isAuthenticated && (
                <Button
                    color="primary"
                    sx={{ width: "fit-content" }}
                    onClick={handleRateItem}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <RateReviewIcon color="primary" />
                        <Typography variant="body1" fontWeight={500}>
                            Write a review
                        </Typography>
                    </Stack>
                </Button>
            )}
        </Box>
    );
}
