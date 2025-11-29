import CheckIcon from "@mui/icons-material/Check";
import ComputerIcon from "@mui/icons-material/Computer";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import InterestsIcon from "@mui/icons-material/Interests";
import LightModeIcon from "@mui/icons-material/LightMode";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../api";
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
const HideOnScroll = ({ children }) => {
    const trigger = useScrollTrigger({ threshold: 100 });

    return (
        <Slide appear={false} direction="down" in={!trigger} timeout={200}>
            {children ?? <div />}
        </Slide>
    );
};

/**
 * Main header component with navigation and user menu
 *
 * Provides responsive navigation with mobile drawer and desktop menu.
 * Includes theme switching, user authentication, and navigation links.
 * Automatically hides on scroll for better user experience.
 */
function Header() {
    const { access, user, logout } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();
    const { mode, setMode } = useColorScheme();
    const mainMenu = useMenu();
    const themeMenu = useMenu();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 900px
    const searchBarRef = useRef(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [searchActive, setSearchActive] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [value, setValue] = useState(query || "");
    const [options, setOptions] = useState([]);

    const handleInput = () => {
        setSearchActive(true);
    };

    const handleClick = () => {
        setSearchActive(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchActive(false);
        if (e.target[0].value.trim() !== "") {
            navigate(`/search?query=${e.target[0].value.trim()}`);
        }
    };

    const handleClickOutside = useCallback(
        (e) => {
            if (
                !isMobile &&
                searchBarRef.current &&
                !searchBarRef.current.contains(e.target)
            ) {
                setSearchActive(false);
            }
        },
        [isMobile, searchBarRef]
    );

    useEffect(() => {
        if (searchActive) {
            // Only add click listener on desktop (mobile uses Dialog's onClose)
            if (!isMobile) {
                document.body.style.overflow = "hidden";
                document.addEventListener("click", handleClickOutside);
            }

            return () => {
                if (!isMobile) {
                    document.body.style.overflow = "";
                    document.removeEventListener("click", handleClickOutside);
                }
            };
        } else {
            // Clean up listener if it exists (shouldn't happen, but safety check)
            if (!isMobile) {
                document.body.style.overflow = "";
                document.removeEventListener("click", handleClickOutside);
            }
        }
    }, [searchActive, isMobile, handleClickOutside]);

    useEffect(() => {
        setValue(query || "");
    }, [query]);

    const getSuggestions = useCallback(async (page = 1) => {
        try {
            const endpoint = "/api/suggestions/suggestions";

            const params = { page, page_size: 50 };
            const res = await api.get(endpoint, { params });

            const uniqueSuggestions = res.data.results.filter(
                (suggestion, index, self) =>
                    index ===
                    self.findIndex(
                        (s) => s.external_id === suggestion.external_id
                    )
            );
            setOptions(uniqueSuggestions.map((item) => item.name));
        } catch (error) {
            console.error("Failed to load suggestions for search bar.", error);
        }
    }, []);

    useEffect(() => {
        getSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigation items for the mobile drawer
    const drawerListItems = [
        {
            label: "Saved",
            icon: <FavoriteIcon />,
            path: "/saved",
            requiresAuth: true,
        },
        {
            label:
                access && user && user.finished_onboarding
                    ? "Update your information"
                    : "Finish onboarding",
            icon: <InterestsIcon />,
            path: "/onboarding",
            requiresAuth: true,
        },
        {
            label: "About Us",
            icon: <InfoIcon />,
            path: "/about",
            requiresAuth: false,
        },
        {
            label: "Source Code",
            icon: <GitHubIcon />,
            path: "https://github.com/YianXie/path-finder",
            external: "https://github.com/YianXie/path-finder",
            requiresAuth: false,
        },
        {
            label: "Request a new item",
            icon: <OpenInNewIcon />,
            path: null,
            external: "https://forms.gle/yeXqMeYjKnoHSmdo6",
        },
        ...(access && user
            ? [
                  {
                      label: "Logout",
                      icon: <Logout />,
                      path: "/logout",
                      requiresAuth: true,
                  },
              ]
            : [
                  {
                      label: "Login",
                      icon: <Login />,
                      path: "/login",
                      requiresAuth: false,
                  },
              ]),
    ].filter((item) => !item.requiresAuth || (access && user));

    /**
     * Toggles the mobile drawer open/closed state
     * @param {boolean} newOpen - Whether the drawer should be open
     */
    const toggleDrawer = (newOpen) => {
        setDrawerOpen(newOpen);
    };

    const drawerList = (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* User info section at top of drawer */}
            {access && user && (
                <>
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Avatar
                            {...stringAvatar(user.name)}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {user.name}
                            </Typography>
                            {user.email && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                >
                                    {user.email}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </>
            )}
            <Box sx={{ flex: 1, overflow: "auto" }}>
                <List sx={{ py: 1 }}>
                    {drawerListItems.map((item, index) => (
                        <ListItem
                            key={item.path || item.external || index}
                            disablePadding
                        >
                            <ListItemButton
                                onClick={() => {
                                    if (item.external) {
                                        window.open(item.external, "_blank");
                                    } else {
                                        navigate(item.path);
                                    }
                                    toggleDrawer(false);
                                }}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {/* Theme selector in drawer */}
                <>
                    <Divider sx={{ my: 1 }} />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={themeMenu.handleClick}
                                sx={{ py: 1.5, px: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <ContrastIcon />
                                </ListItemIcon>
                                <ListItemText primary="Theme" />
                            </ListItemButton>
                        </ListItem>
                    </List>
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
                                <ListItemIcon sx={{ marginLeft: 2 }}>
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
                                <ListItemIcon sx={{ marginLeft: 2 }}>
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
                                <ListItemIcon sx={{ marginLeft: 2 }}>
                                    <CheckIcon fontSize="small" />
                                </ListItemIcon>
                            )}
                        </MenuItem>
                    </Menu>
                </>
            </Box>
        </Box>
    );

    return (
        <>
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
                        gap={isMobile ? 1 : isTablet ? 2 : 3}
                        paddingBlock={isMobile ? 1 : 1.5}
                        paddingInline={isMobile ? 1.5 : isTablet ? 2.5 : 4}
                        borderBottom={1}
                        borderColor="divider"
                        sx={{
                            flexWrap: isMobile ? "nowrap" : "wrap",
                        }}
                    >
                        {/* Logo and Title */}
                        <Box
                            to="/"
                            display="flex"
                            alignItems="center"
                            gap={isMobile ? 0.5 : 1}
                            sx={{
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                            onClick={() => navigate("/")}
                        >
                            <img
                                src="/logo.png"
                                alt="PathFinder"
                                width={isMobile ? 28 : 32}
                                height={isMobile ? 28 : 32}
                                draggable={false}
                                style={{ userSelect: "none" }}
                            />
                            <Typography
                                variant={isMobile ? "subtitle1" : "h6"}
                                sx={{
                                    userSelect: "none",
                                    fontWeight: 600,
                                    display: isMobile ? "none" : "block",
                                }}
                            >
                                PathFinder
                            </Typography>
                        </Box>

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDrawer(true);
                                }}
                                sx={{ flexShrink: 0 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Search Bar - Hidden on mobile, shown as icon */}
                        {isMobile ? (
                            <IconButton
                                onClick={() => setSearchActive(true)}
                                sx={{ ml: "auto", flexShrink: 0 }}
                                aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>
                        ) : (
                            <>
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                    }}
                                />
                                <form
                                    ref={searchBarRef}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flex: isTablet
                                            ? "1 1 auto"
                                            : "0 1 auto",
                                        minWidth: 0,
                                    }}
                                    onSubmit={handleSubmit}
                                >
                                    <Autocomplete
                                        freeSolo
                                        value={value}
                                        onChange={(_, newValue) =>
                                            setValue(newValue)
                                        }
                                        onInputChange={(_, newInputValue) =>
                                            handleInput(newInputValue)
                                        }
                                        options={options}
                                        slotProps={{
                                            popper: {
                                                sx: {
                                                    boxShadow:
                                                        "0 0 10px rgba(0, 0, 0, 0.1)",
                                                    scrollbarWidth: "none",
                                                    "&::-webkit-scrollbar": {
                                                        display: "none",
                                                    },
                                                },
                                            },
                                        }}
                                        sx={{
                                            width: isTablet
                                                ? "100%"
                                                : {
                                                      xs: "100%",
                                                      sm: 300,
                                                      md: 350,
                                                  },
                                            maxWidth: "100%",
                                            margin: "10px auto",
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                id="search-bar"
                                                className="text"
                                                onClick={handleClick}
                                                label={
                                                    isTablet
                                                        ? "Search"
                                                        : "Search items"
                                                }
                                                variant="outlined"
                                                placeholder="Search..."
                                                size="small"
                                            />
                                        )}
                                    />
                                    <IconButton
                                        type="submit"
                                        aria-label="search"
                                        sx={{ flexShrink: 0 }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </form>
                            </>
                        )}
                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <>
                                <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                        display: { xs: "none", sm: "block" },
                                    }}
                                />
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={isTablet ? 1 : 2}
                                    ml="auto"
                                    sx={{ flexShrink: 0 }}
                                >
                                    <HeaderLink to="/about">
                                        About Us
                                    </HeaderLink>
                                    <HeaderLink
                                        to="https://github.com/YianXie/path-finder"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tooltip title="Source Code" arrow>
                                            <GitHubIcon
                                                fontSize="large"
                                                sx={{
                                                    transition:
                                                        "opacity 0.2s ease-in-out",
                                                    "&:hover": {
                                                        opacity: 0.8,
                                                    },
                                                }}
                                            />
                                        </Tooltip>
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
                                                    onClick={
                                                        mainMenu.handleClick
                                                    }
                                                >
                                                    <Avatar
                                                        {...stringAvatar(
                                                            user.name
                                                        )}
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
                                                            "& .MuiAvatar-root":
                                                                {
                                                                    width: 32,
                                                                    height: 32,
                                                                    ml: -0.5,
                                                                    mr: 1,
                                                                },
                                                            "&::before": {
                                                                content: '""',
                                                                display:
                                                                    "block",
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
                                                    onClick={() => {
                                                        window.open(
                                                            "https://forms.gle/yeXqMeYjKnoHSmdo6",
                                                            "_blank"
                                                        );
                                                        mainMenu.handleClose(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <OpenInNewIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    Request a new item
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={
                                                        themeMenu.handleClick
                                                    }
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
                                                            "& .MuiAvatar-root":
                                                                {
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
                                                            sx={{
                                                                marginLeft: 2,
                                                            }}
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
                                                            sx={{
                                                                marginLeft: 2,
                                                            }}
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
                                                            sx={{
                                                                marginLeft: 2,
                                                            }}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </ListItemIcon>
                                                    )}
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <HeaderLink to="/login">
                                            Login
                                        </HeaderLink>
                                    )}
                                </Box>
                            </>
                        )}

                        {/* Mobile Drawer */}
                        {isMobile && (
                            <Drawer
                                open={drawerOpen}
                                onClose={() => toggleDrawer(false)}
                                anchor="right"
                                slotProps={{
                                    paper: {
                                        sx: {
                                            width: "80vw",
                                            maxWidth: 400,
                                            borderRadius: 0,
                                            maxHeight: "100vh",
                                        },
                                    },
                                }}
                            >
                                {drawerList}
                            </Drawer>
                        )}
                    </Box>
                </header>
            </HideOnScroll>

            {/* Mobile Search Dialog */}
            {isMobile && (
                <Dialog
                    open={searchActive}
                    onClose={() => setSearchActive(false)}
                    fullWidth
                    maxWidth="sm"
                    aria-labelledby="search-dialog-title"
                >
                    <DialogTitle id="search-dialog-title" textAlign={"center"}>
                        Search for an item
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <Autocomplete
                                freeSolo
                                value={value}
                                onChange={(_, newValue) => setValue(newValue)}
                                onInputChange={(_, newInputValue) =>
                                    handleInput(newInputValue)
                                }
                                options={options}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        id="mobile-search-bar"
                                        className="text"
                                        variant="outlined"
                                        placeholder="Search..."
                                        size="medium"
                                        autoFocus
                                    />
                                )}
                            />
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default Header;
