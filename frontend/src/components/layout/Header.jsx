import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import HeaderLink from "./HeaderLink";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const setSnackBar = useSnackBar();
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
        };
    }

    return (
        <header>
            <Box
                position={"sticky"}
                top={0}
                zIndex={1000}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={3}
                paddingBlock={2}
                paddingInline={4}
                borderBottom={1}
                borderColor="divider"
            >
                <Box
                    to="/"
                    display="flex"
                    alignItems="center"
                    className="cursor-pointer"
                    gap={1}
                    onClick={() => navigate("/")}
                >
                    <img
                        src="/logo.png"
                        alt="PathFinder"
                        width={32}
                        height={32}
                        draggable={false}
                        className="select-none"
                    />
                    <Typography variant="h6" className="select-none">
                        PathFinder
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <HeaderLink to="/clubs">Clubs</HeaderLink>
                <HeaderLink to="/competitions">Competitions</HeaderLink>
                <HeaderLink to="/tutoring">Tutoring</HeaderLink>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    ml="auto"
                >
                    <Divider orientation="vertical" flexItem />
                    {isAuthenticated && user ? (
                        <>
                            <Tooltip title="Profile" placement="bottom">
                                <IconButton size="small" onClick={handleClick}>
                                    <Avatar
                                        {...stringAvatar(user.name)}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                            "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            "&::before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform:
                                                    "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{
                                    horizontal: "right",
                                    vertical: "top",
                                }}
                                anchorOrigin={{
                                    horizontal: "right",
                                    vertical: "bottom",
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    My profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <FavoriteIcon fontSize="small" />{" "}
                                    </ListItemIcon>
                                    Saved items
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        logout();
                                        handleClose();
                                        setSnackBar({
                                            message: "Logged out successfully",
                                            severity: "success",
                                        });
                                        navigate("/login");
                                    }}
                                >
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <HeaderLink to="/login">Login</HeaderLink>
                    )}
                </Box>
            </Box>
        </header>
    );
}

export default Header;
