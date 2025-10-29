import CalculateIcon from "@mui/icons-material/Calculate";
import CheckIcon from "@mui/icons-material/Check";
import ComputerIcon from "@mui/icons-material/Computer";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import InterestsIcon from "@mui/icons-material/Interests";
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
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import { useMenu } from "../../hooks";
import { stringAvatar } from "../../utils";
import HeaderLink from "./HeaderLink";

/**
 * Component that hides its children when scrolling down
 * Used to hide the header when user scrolls down the page
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to hide/show
 */
function HideOnScroll({ children }) {
    const trigger = useScrollTrigger({
        threshold: 100,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger} timeout={200}>
            {children}
        </Slide>
    );
}

/**
 * Main header component with navigation and user menu
 *
 * Provides responsive navigation with mobile drawer and desktop menu.
 * Includes theme switching, user authentication, and navigation links.
 * Automatically hides on scroll for better user experience.
 */
function Header() {
    // Navigation items for the mobile drawer
    const drawerListItems = [
        {
            label: "Clubs",
            icon: <GroupsIcon />,
            path: "/clubs",
        },
        {
            label: "Competitions",
            icon: <CalculateIcon />,
            path: "/competitions",
        },
        {
            label: "Tutoring",
            icon: <SchoolIcon />,
            path: "/tutoring",
        },
        {
            label: "Saved",
            icon: <FavoriteIcon />,
            path: "/saved",
        },
    ];
    const { access, user, logout } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();
    const { mode, setMode } = useColorScheme();
    const mainMenu = useMenu();
    const themeMenu = useMenu();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const theme = useTheme();

    /**
     * Toggles the mobile drawer open/closed state
     * @param {boolean} newOpen - Whether the drawer should be open
     */
    const toggleDrawer = (newOpen) => {
        setDrawerOpen(newOpen);
    };

    const drawerList = (
        <Box onClick={() => toggleDrawer(false)}>
            <List>
                {drawerListItems.map((item) => (
                    <ListItem key={item.path}>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
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
                    backdropFilter: "blur(6px)",
                    opacity: 0.9,
                    backgroundColor: theme.palette.background.paper,
                    willChange: "transform",
                }}
            >
                <Box
                    display="flex"
                    justifyContent={isMobile ? "space-between" : "center"}
                    alignItems="center"
                    gap={3}
                    paddingBlock={1.5}
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
                            <MenuIcon />
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
                                <HeaderLink to="/about">
                                    About this site
                                </HeaderLink>
                                <Divider orientation="vertical" flexItem />
                                {access && user ? (
                                    <>
                                        <Tooltip
                                            title="Account Settings"
                                            placement="bottom"
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={mainMenu.handleClick}
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
                                            anchorEl={mainMenu.anchorEl}
                                            open={mainMenu.open}
                                            onClose={mainMenu.handleClose}
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
                                                    mainMenu.handleClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <FavoriteIcon fontSize="small" />
                                                </ListItemIcon>
                                                Saved items
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    navigate("/onboarding");
                                                    mainMenu.handleClose();
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <InterestsIcon fontSize="small" />
                                                </ListItemIcon>
                                                {user.finished_onboarding
                                                    ? "Update your information"
                                                    : "Finish onboarding"}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={themeMenu.handleClick}
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
                                                    mainMenu.handleClose();
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
                                            anchorEl={themeMenu.anchorEl}
                                            open={themeMenu.open}
                                            onClose={themeMenu.handleClose}
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
                                                    themeMenu.handleClose();
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
                                                    themeMenu.handleClose();
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
                                                    themeMenu.handleClose();
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
