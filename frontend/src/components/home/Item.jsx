import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import { useSnackBar } from "../../contexts/SnackBarContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Item({ title, description, image, link }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { setSnackBar } = useSnackBar();
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSave = async () => {
        if (isFavorite) {
            setSnackBar({ open: true, message: "Item unsaved" });
            setIsFavorite(false);
            return;
        }
        setSnackBar({ open: true, message: "Item saved" });
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setSnackBar({ open: true, message: "Link copied to clipboard" });
        } catch (error) {
            console.error("Failed to copy link to clipboard", error);
        }
    };

    return (
        <Card sx={{ maxWidth: 300 }}>
            <CardActionArea onClick={() => navigate(link)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className="flex items-center justify-end">
                <Button size="small" color="primary" onClick={handleSave}>
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </Button>
                <Button size="small" color="primary" onClick={handleMenuClick}>
                    <MenuIcon />
                </Button>
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
