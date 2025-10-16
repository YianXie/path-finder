import { useEffect, useState } from "react";
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

function Home() {
    usePageTitle("PathFinder | Home");

    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        async function getSuggestions() {
            try {
                const res = await api.get("/api/suggestions/");
                setSuggestions(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        getSuggestions();
    }, []);

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
            <Divider sx={{ marginBlock: 4 }} />
            <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 4, sm: 5, md: 6 }}
                alignItems="center"
                justifyContent="center"
            >
                {suggestions.map((suggestion, index) => (
                    <Item id={index + 1} {...suggestion} />
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
