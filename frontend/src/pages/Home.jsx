import usePageTitle from "../hooks/usePageTitle";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Item from "../components/home/Item";

function Home() {
    usePageTitle("PathFinder | Home");

    return (
        <Container maxWidth="xl" sx={{ paddingBlock: 4 }}>
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
                spacing={5}
                alignItems="center"
                justifyContent="center"
            >
                <Item
                    id="1"
                    title="Competitions"
                    description="Competitions"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
                <Item
                    id="2"
                    title="Clubs"
                    description="Clubs"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
                <Item
                    id="3"
                    title="Internships"
                    description="Internships"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
                <Item
                    id="4"
                    title="Competitions"
                    description="Competitions"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
                <Item
                    id="5"
                    title="Clubs"
                    description="Clubs"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
                <Item
                    id="6"
                    title="Internships"
                    description="Internships"
                    image="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    link="#"
                />
            </Grid>
        </Container>
    );
}

export default Home;
