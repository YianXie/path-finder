import CalculateIcon from "@mui/icons-material/Calculate";
import CheckIcon from "@mui/icons-material/Check";
import ComputerIcon from "@mui/icons-material/Computer";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import LightModeIcon from "@mui/icons-material/LightMode";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import HeaderLink from "./HeaderLink";

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();
    const { mode, setMode } = useColorScheme();
    const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState(null);
    const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const mainMenuOpen = Boolean(mainMenuAnchorEl);
    const themeMenuOpen = Boolean(themeMenuAnchorEl);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const handleMenuClick = (event) => {
        setMainMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMainMenuAnchorEl(null);
    };

    const handleThemeMenuClick = (event) => {
        setThemeMenuAnchorEl(event.currentTarget);
    };

    const handleThemeMenuClose = () => {
        setThemeMenuAnchorEl(null);
    };

    const toggleDrawer = (newOpen) => {
        setDrawerOpen(newOpen);
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

    const drawerList = (
        <Box onClick={() => toggleDrawer(false)}>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/clubs")}>
                        <ListItemIcon>
                            <GroupsIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText primary="Clubs" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/competitions")}>
                        <ListItemIcon>
                            <CalculateIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText primary="Competitions" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/tutoring")}>
                        <ListItemIcon>
                            <SchoolIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText primary="Tutoring" />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/saved")}>
                        <ListItemIcon>
                            <FavoriteIcon fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText primary="Saved" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <HideOnScroll>
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box
                    display="flex"
                    justifyContent={isMobile ? "space-between" : "center"}
                    alignItems="center"
                    gap={3}
                    paddingBlock={2}
                    paddingInline={isMobile ? 2 : 4}
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
                    {isMobile && (
                        <IconButton onClick={() => toggleDrawer(true)}>
                            <MenuIcon fontSize="medium" />
                        </IconButton>
                    )}
                    {isMobile ? (
                        <Drawer
                            open={drawerOpen}
                            onClose={() => toggleDrawer(false)}
                            anchor="right"
                        >
                            {drawerList}
                        </Drawer>
                    ) : (
                        <>
                            <Divider orientation="vertical" flexItem />
                            <HeaderLink to="/clubs">Clubs</HeaderLink>
                            <HeaderLink to="/competitions">
                                Competitions
                            </HeaderLink>
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
                                        <Tooltip
                                            title="Account Settings"
                                            placement="bottom"
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={(event) => {
                                                    handleMenuClick(event);
                                                }}
                                            >
                                                <Avatar
                                                    {...stringAvatar(user.name)}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={mainMenuAnchorEl}
                                            open={mainMenuOpen}
                                            onClose={handleMenuClose}
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
                                                            position:
                                                                "absolute",
                                                            top: 0,
                                                            right: 14,
                                                            width: 10,
                                                            height: 10,
                                                            bgcolor:
                                                                "background.paper",
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
                                            <MenuItem
                                                onClick={() => {
                                                    navigate("/saved");
                                                    handleMenuClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <FavoriteIcon fontSize="small" />
                                                </ListItemIcon>
                                                Saved items
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleThemeMenuClick}
                                            >
                                                <ListItemIcon>
                                                    <ContrastIcon fontSize="small" />
                                                </ListItemIcon>
                                                Theme
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem
                                                onClick={() => {
                                                    logout();
                                                    handleMenuClose();
                                                    setSnackBar({
                                                        ...snackBar,
                                                        open: true,
                                                        severity: "success",
                                                        message:
                                                            "Logged out successfully",
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
                                        <Menu
                                            anchorEl={themeMenuAnchorEl}
                                            open={themeMenuOpen}
                                            onClose={handleThemeMenuClose}
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
                                            <MenuItem
                                                onClick={() => {
                                                    setMode("system");
                                                    handleThemeMenuClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <ComputerIcon fontSize="small" />
                                                </ListItemIcon>
                                                System default
                                                {mode === "system" && (
                                                    <ListItemIcon
                                                        sx={{ marginLeft: 2 }}
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </ListItemIcon>
                                                )}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMode("light");
                                                    handleThemeMenuClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <LightModeIcon fontSize="small" />
                                                </ListItemIcon>
                                                Light mode
                                                {mode === "light" && (
                                                    <ListItemIcon
                                                        sx={{ marginLeft: 2 }}
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </ListItemIcon>
                                                )}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMode("dark");
                                                    handleThemeMenuClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <DarkModeIcon fontSize="small" />
                                                </ListItemIcon>
                                                Dark mode
                                                {mode === "dark" && (
                                                    <ListItemIcon
                                                        sx={{ marginLeft: 2 }}
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </ListItemIcon>
                                                )}
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <HeaderLink to="/login">Login</HeaderLink>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </header>
        </HideOnScroll>
    );
}

export default Header;
