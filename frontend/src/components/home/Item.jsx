import { useSnackBar } from "../../contexts/SnackBarContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

function Item({ id, name, category, description, image }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { snackBar, setSnackBar } = useSnackBar();
    const openMenu = Boolean(anchorEl);

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
            await api.post("/accounts/save-item/", { item_id: id });
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "success",
                message: `Item ${isFavorite ? "removed from" : "saved to"} your profile`,
            });
            setIsFavorite(!isFavorite);
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
            await navigator.clipboard.writeText(location.href + `item/${id}`);
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

    return (
        <Card sx={{ width: 300, maxHeight: 400 }}>
            <Backdrop
                open={isLoading}
                sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                })}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardActionArea onClick={() => navigate(`/item/${id}`)}>
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
                        {truncateString(description, 100)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        {category.join(", ")}
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
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
