import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import usePageTitle from "../hooks/usePageTitle";

/**
 * NotFoundPage component - 404 error page
 *
 * Displays a user-friendly 404 error page when a route is not found.
 * Provides navigation back to the home page.
 */
function NotFoundPage() {
    usePageTitle("PathFinder | Not Found");

    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
            <Typography variant="h1" component="h1" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
                The page you are looking for does not exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/")}
            >
                Go to Home
            </Button>
        </Container>
    );
}

export default NotFoundPage;
