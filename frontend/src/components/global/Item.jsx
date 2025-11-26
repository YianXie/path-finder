import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useItemActions } from "../../hooks";
import { truncateString } from "../../utils";

/**
 * Item component for displaying suggestion cards
 *
 * Displays a card with item information including image, name, description, and category.
 * Provides save/unsave functionality and a menu with additional actions like share.
 * Uses Material-UI components for consistent styling and user interactions.
 *
 * @param {Object} props - Component props
 * @param {string} props.external_id - Unique identifier for the item
 * @param {string} props.name - Item name/title
 * @param {Array<string>} props.category - Array of category strings
 * @param {string} props.description - Item description
 * @param {string} props.image - URL of the item image
 * @param {boolean} props.is_saved - Whether the item is currently saved by the user
 * @param {Function} props.handleSaveStatusUpdate - Callback function called after successful save/unsave
 */
function Item({
    external_id,
    name,
    category,
    description,
    image,
    average_rating: rating,
    rate_count,
    saved_count,
    is_saved: initialIsSaved = false,
    handleSaveStatusUpdate,
    selectedItems,
    setSelectedItems,
}) {
    // React hooks
    const navigate = useNavigate();
    const { handleSave: saveItem, handleShare: shareItem } = useItemActions();
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [showCheckbox, setShowCheckbox] = useState(false);

    // Sync local state with prop changes (useful when item is saved from elsewhere)
    useEffect(() => {
        setIsSaved(initialIsSaved);
    }, [initialIsSaved]);

    /**
     * Handles saving/unsaving the item
     * Updates local state and calls success callback
     */
    const handleSave = async () => {
        await saveItem(external_id, isSaved, () => {
            setIsSaved(!isSaved);
            if (handleSaveStatusUpdate) {
                handleSaveStatusUpdate();
            }
        });
    };

    const handleHover = () => {
        if (selectedItems.length > 0) return;
        setShowCheckbox(true);
    };

    const handleLeave = () => {
        if (selectedItems.length > 0) return;
        setShowCheckbox(false);
    };

    // WIP
    const handleCheckboxChange = () => {
        if (!selectedItems.includes(external_id) && selectedItems.length >= 2) {
            setSelectedItems((prev) => [prev[1], external_id]);
        } else if (!selectedItems.includes(external_id)) {
            setSelectedItems((prev) => [...prev, external_id]);
        } else {
            setSelectedItems((prev) => prev.filter((id) => id !== external_id));
        }
    };

    /**
     * Handles sharing the item by copying its URL to clipboard
     */
    const handleShare = async () => {
        await shareItem(location.href + `item/${external_id}`);
    };

    useEffect(() => {
        if (selectedItems.length === 0) {
            setShowCheckbox(false);
        } else {
            setShowCheckbox(true);
        }
    }, [selectedItems]);

    return (
        <Card
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 300,
                height: 375,
            }}
        >
            <Checkbox
                size="medium"
                color="primary"
                sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    zIndex: 999,
                    transition: "opacity 0.3s ease-in-out",
                    opacity: showCheckbox ? 1 : 0,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "4px",
                    padding: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                }}
                checked={selectedItems.includes(external_id)}
                onChange={handleCheckboxChange}
            />
            {/* Clickable area that navigates to item detail page */}
            <CardActionArea onClick={() => navigate(`/item/${external_id}`)}>
                <CardMedia
                    component="img"
                    image={image}
                    draggable={false}
                    alt={name}
                    sx={{ objectFit: "cover", height: 200 }}
                />
                {/* Item information display */}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {truncateString(name, 20)}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                    >
                        {truncateString(description, 25)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        {truncateString(category.join(", "), 20)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* Action buttons for save and menu */}
            <CardActions
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    gap={0.5}
                    sx={{ marginRight: "auto" }}
                >
                    <Rating value={rating} readOnly />
                    <Typography
                        variant="body2"
                        fontSize={16}
                        sx={{ color: "text.secondary" }}
                    >
                        ({rate_count})
                    </Typography>
                </Stack>
                <Stack alignItems="center" direction="row" gap={0.5}>
                    <Tooltip
                        title={isSaved ? "Unsave item" : "Save item"}
                        placement="bottom"
                        arrow
                        sx={{ padding: 0 }}
                    >
                        <IconButton
                            aria-label={isSaved ? "Unsave item" : "Save item"}
                            onClick={handleSave}
                            color="primary"
                        >
                            {isSaved ? (
                                <FavoriteIcon />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Typography
                        variant="body2"
                        fontSize={16}
                        sx={{ color: "text.secondary" }}
                    >
                        ({saved_count})
                    </Typography>
                </Stack>
                <Tooltip
                    title="Share item"
                    placement="bottom"
                    arrow
                    sx={{ alignSelf: "center" }}
                >
                    <IconButton
                        aria-label="Share item"
                        onClick={handleShare}
                        color="primary"
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Item);
