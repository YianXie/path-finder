import { useEffect, useState } from "react";
import { useSnackBar } from "../contexts/SnackBarContext";
import api from "../api";
import Item from "../components/home/Item";
import usePageTitle from "../hooks/usePageTitle";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Home() {
    usePageTitle("PathFinder | Home");

    const { snackBar, setSnackBar } = useSnackBar();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [sortBy, setSortBy] = useState("alphabetical");
    const [sortDirection, setSortDirection] = useState(1); // 1 for ascending, -1 for descending

    useEffect(() => {
        async function getSuggestions() {
            try {
                const res = await api.get("/api/suggestions/");
                setSuggestions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        getSuggestions();
    }, []);

    useEffect(() => {
        switch (sortBy.toLowerCase()) {
            case "alphabetical":
                setSuggestions(
                    suggestions.sort(
                        (a, b) => a.name.localeCompare(b.name) * sortDirection
                    )
                );
                break;
            case "newest":
                // TODO: Need to implement this
                break;

            case "oldest":
                // TODO: Need to implement this
                break;

            default:
                setSuggestions(suggestions);
                break;
        }
    }, [sortBy, suggestions, sortDirection]);

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
                rowSpacing={5}
                columnSpacing={{ xs: 4, sm: 5, md: 6 }}
                alignItems="center"
                justifyContent="space-between"
            >
                {suggestions.map((suggestion, index) => (
                    <Item id={index + 1} {...suggestion} />
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
