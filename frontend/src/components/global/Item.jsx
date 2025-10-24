import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
 * @param {Function} props.onSaveSuccess - Callback function called after successful save/unsave
 */
function Item({
    external_id,
    name,
    category,
    description,
    image,
    is_saved: initialIsSaved = false,
    onSaveSuccess,
}) {
    // React hooks
    const navigate = useNavigate();
    const { handleSave: saveItem, handleShare: shareItem } = useItemActions();
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // Sync local state with prop changes (useful when item is saved from elsewhere)
    useEffect(() => {
        setIsSaved(initialIsSaved);
    }, [initialIsSaved]);

    /**
     * Opens the menu by setting the anchor element
     * @param {Event} event - The click event
     */
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the menu by clearing the anchor element
     */
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    /**
     * Handles saving/unsaving the item
     * Updates local state and calls success callback
     */
    const handleSave = async () => {
        await saveItem(external_id, isSaved, () => {
            setIsSaved(!isSaved);
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        });
    };

    /**
     * Handles sharing the item by copying its URL to clipboard
     */
    const handleShare = async () => {
        await shareItem(location.href + `item/${external_id}`);
    };

    return (
        <Card sx={{ width: 300, maxHeight: 400 }}>
            {/* Clickable area that navigates to item detail page */}
            <CardActionArea onClick={() => navigate(`/item/${external_id}`)}>
                <CardMedia
                    component="img"
                    image={image}
                    draggable={false}
                    alt={name}
                    sx={{ objectFit: "cover", maxHeight: 200 }}
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
            <CardActions className="flex items-center justify-end">
                <Tooltip title="Save item" placement="bottom" arrow>
                    <IconButton
                        aria-label="Save item"
                        onClick={handleSave}
                        color="primary"
                    >
                        {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Open menu" placement="bottom" arrow>
                    <IconButton
                        aria-label="Open menu"
                        onClick={handleMenuClick}
                        color="primary"
                    >
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
                {/* Dropdown menu with additional actions */}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    slotProps={{
                        list: {
                            "aria-labelledby": "basic-button",
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleShare();
                            handleCloseMenu();
                        }}
                    >
                        Share
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        Recommend more
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        Not interested
                    </MenuItem>
                </Menu>
            </CardActions>
        </Card>
    );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Item);
