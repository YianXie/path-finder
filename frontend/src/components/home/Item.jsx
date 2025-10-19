import { useSnackBar } from "../../contexts/SnackBarContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

function Item({ external_id, name, category, description, image }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { snackBar, setSnackBar } = useSnackBar();
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        async function checkIfItemSaved() {
            try {
                const res = await api.post("/accounts/check-item-saved/", {
                    external_id: external_id,
                });
                setIsSaved(res.data.is_saved);
            } catch (error) {
                console.error("Failed to check if item is saved", error);
            } finally {
                setIsLoading(false);
            }
        }
        checkIfItemSaved();
    }, [external_id]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: "Please login to save items",
            });
            return;
        }

        try {
            setIsLoading(true);
            await api.post("/accounts/save-item/", {
                external_id: external_id,
            });
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "success",
                message: `Item ${isSaved ? "removed from" : "saved to"} your profile`,
            });
            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Failed to save item to your profile", error);
            setSnackBar({
                ...snackBar,
                severity: "error",
                open: true,
                message:
                    "Failed to save item to your profile: " + error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(
                location.href + `item/${external_id}`
            );
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "success",
                message: "Link copied to clipboard",
            });
        } catch (error) {
            console.error("Failed to copy link to clipboard", error);
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: "Failed to copy link to clipboard: " + error.message,
            });
        }
    };

    const truncateString = (string, maxLength) => {
        if (string.length > maxLength) {
            return string.slice(0, maxLength) + "...";
        }
        return string;
    };

    return isLoading ? (
        <Skeleton variant="rounded" width={300} height={350} animation="wave" />
    ) : (
        <Card sx={{ width: 300, maxHeight: 400 }}>
            <CardActionArea onClick={() => navigate(`/item/${external_id}`)}>
                <CardMedia
                    component="img"
                    image={image}
                    draggable={false}
                    alt={name}
                    sx={{ objectFit: "cover", maxHeight: 200 }}
                />
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

export default Item;
