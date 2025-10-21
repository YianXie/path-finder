import SwapVertIcon from "@mui/icons-material/SwapVert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";

import api from "../api";
import Item from "../components/global/Item";
import { useAuth } from "../contexts/AuthContext";
import { useSnackBar } from "../contexts/SnackBarContext";
import usePageTitle from "../hooks/usePageTitle";

function Home() {
    usePageTitle("PathFinder | Home");

    const { snackBar, setSnackBar } = useSnackBar();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [sortBy, setSortBy] = useState("alphabetical");
    const [sortDirection, setSortDirection] = useState(1); // 1 for ascending, -1 for descending
    const [pagination, setPagination] = useState({
        page: 1,
        page_size: 50,
        total_pages: 1,
        total_count: 0,
        has_next: false,
        has_previous: false,
    });

    const getSuggestions = useCallback(
        async (page = 1) => {
            try {
                setIsLoading(true);
                // Use the optimized endpoint for authenticated users
                const endpoint = isAuthenticated
                    ? "/api/suggestions-with-saved-status/"
                    : "/api/suggestions/";

                const params = isAuthenticated ? { page, page_size: 50 } : {};
                const res = await api.get(endpoint, { params });

                if (isAuthenticated && res.data.results) {
                    // Handle paginated response
                    setSuggestions(res.data.results);
                    setPagination(res.data.pagination);
                } else {
                    // Handle non-paginated response
                    setSuggestions(res.data);
                    setPagination({
                        page: 1,
                        page_size: res.data.length,
                        total_pages: 1,
                        total_count: res.data.length,
                        has_next: false,
                        has_previous: false,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSnackBar({
                    ...snackBar,
                    severity: "error",
                    open: true,
                    message: "Failed to load suggestions. Please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [isAuthenticated, snackBar, setSnackBar]
    );

    // Function to refresh suggestions (useful after saving/unsaving items)
    const refreshSuggestions = useCallback(() => {
        if (isAuthenticated) {
            getSuggestions(pagination.page);
        }
    }, [isAuthenticated, getSuggestions, pagination.page]);

    useEffect(() => {
        getSuggestions();
    }, [getSuggestions]);

    // Memoized sorted suggestions to avoid unnecessary re-sorting
    const sortedSuggestions = useMemo(() => {
        const suggestionsCopy = [...suggestions];

        switch (sortBy.toLowerCase()) {
            case "alphabetical":
                return suggestionsCopy.sort(
                    (a, b) => a.name.localeCompare(b.name) * sortDirection
                );
            case "newest":
                // Sort by created_at if available, otherwise by name
                return suggestionsCopy.sort((a, b) => {
                    if (a.created_at && b.created_at) {
                        return (
                            (new Date(b.created_at) - new Date(a.created_at)) *
                            sortDirection
                        );
                    }
                    return a.name.localeCompare(b.name) * sortDirection;
                });
            case "oldest":
                // Sort by created_at if available, otherwise by name
                return suggestionsCopy.sort((a, b) => {
                    if (a.created_at && b.created_at) {
                        return (
                            (new Date(a.created_at) - new Date(b.created_at)) *
                            sortDirection
                        );
                    }
                    return a.name.localeCompare(b.name) * sortDirection;
                });
            default:
                return suggestionsCopy;
        }
    }, [suggestions, sortBy, sortDirection]);

    return (
        <Container maxWidth="xl" sx={{ paddingBlock: 4 }}>
            <Backdrop
                open={isLoading}
                sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                })}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h3" fontWeight={500}>
                    Welcome to PathFinder
                </Typography>
                <Typography variant="h6" fontWeight={400}>
                    All items
                </Typography>
            </Box>
            <Divider sx={{ marginTop: 2 }} />
            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                <FormControl sx={{ marginBlock: 4 }} size="small">
                    <InputLabel id="sort-by-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        label="Sort by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="alphabetical">Alphabetical</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title="Toggle sort direction" placement="bottom" arrow>
                    <IconButton
                        onClick={() => {
                            setSnackBar({
                                ...snackBar,
                                severity: "success",
                                open: true,
                                message: `Sorting direction changed to ${sortDirection === 1 ? "ascending" : "descending"}`,
                            });
                            setSortDirection(sortDirection * -1);
                        }}
                        aria-label="Toggle sort direction"
                    >
                        {sortDirection === 1 ? (
                            <SwapVertIcon
                                sx={{
                                    transition: "transform 0.3s ease-in-out",
                                }}
                            />
                        ) : (
                            <SwapVertIcon
                                sx={{
                                    transform: "scaleY(-1)",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                            />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
            >
                {sortedSuggestions.map((suggestion) => (
                    <Item
                        key={suggestion.external_id}
                        {...suggestion}
                        onSaveSuccess={refreshSuggestions}
                    />
                ))}
            </Grid>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
                <Stack spacing={2} alignItems="center" sx={{ marginTop: 4 }}>
                    <Pagination
                        count={pagination.total_pages}
                        page={pagination.page}
                        onChange={(event, page) => getSuggestions(page)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                    <Typography variant="body2" color="text.secondary">
                        Showing{" "}
                        {(pagination.page - 1) * pagination.page_size + 1} to{" "}
                        {Math.min(
                            pagination.page * pagination.page_size,
                            pagination.total_count
                        )}{" "}
                        of {pagination.total_count} items
                    </Typography>
                </Stack>
            )}
        </Container>
    );
}

export default Home;
