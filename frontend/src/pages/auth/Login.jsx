import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GoogleButton from "../../components/global/GoogleButton";
import { useAuth } from "../../contexts/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

function Login() {
    usePageTitle("PathFinder | Login");
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Container className="flex h-screen items-center justify-center">
            <Box
                padding={4}
                bgcolor="primary.light"
                className="flex w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-md"
            >
                <Typography
                    variant="h4"
                    color="primary.dark"
                    className="text-center text-2xl font-bold"
                >
                    Login
                </Typography>
                <Typography
                    variant="body1"
                    color="primary.dark"
                    className="text-center text-sm"
                >
                    Sign in with your school Google account to continue
                </Typography>
                <GoogleButton />
            </Box>
        </Container>
    );
}

export default Login;
