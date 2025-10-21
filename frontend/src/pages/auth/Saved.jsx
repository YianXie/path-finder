import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import api from "../../api";
import Item from "../../components/global/Item";
import usePageTitle from "../../hooks/usePageTitle";

function Saved() {
    usePageTitle("PathFinder | Saved");

    const [savedItems, setSavedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getSavedItems() {
            try {
                const res = await api.post("/accounts/saved-items/");
                setSavedItems(res.data.suggestions);
            } catch (error) {
                console.error("Failed to get saved items", error);
            } finally {
                setIsLoading(false);
            }
        }
        getSavedItems();
    }, []);

    return (
        <Container>
            <Backdrop
                open={isLoading}
                sx={(theme) => ({
                    zIndex: theme.zIndex.drawer + 1,
                    color: "#fff",
                })}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ marginTop: 4 }}
            >
                <Typography variant="h3" fontWeight={500}>
                    Saved
                </Typography>
                <Typography variant="h6" fontWeight={400}>
                    Saved items
                </Typography>
            </Box>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
            <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
            >
                {savedItems.map((item) => (
                    <Item key={item.external_id} {...item} is_saved={true} /> // set is_saved to true since this is the saved page
                ))}
            </Grid>
        </Container>
    );
}

export default Saved;
