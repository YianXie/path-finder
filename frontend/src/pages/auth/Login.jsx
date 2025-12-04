import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GoogleButton from "../../components/global/GoogleButton";
import { useAuth } from "../../contexts/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

/**
 * Login page component - User authentication
 *
 * Provides Google Sign-In authentication interface.
 * Redirects authenticated users to home page automatically.
 * Displays a centered login card with Google authentication button.
 */
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
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 200px)",
                py: 4,
            }}
        >
            <Card
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 3,
                    overflow: "visible",
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack spacing={3} alignItems="center">
                        {/* Logo and Branding */}
                        <Stack spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="PathFinder"
                                sx={{
                                    width: 64,
                                    height: 64,
                                    userSelect: "none",
                                }}
                            />
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight={600}
                                textAlign="center"
                            >
                                Welcome to PathFinder
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ maxWidth: 320 }}
                            >
                                Sign in with your school Google account to
                                discover personalized opportunities and pathways
                            </Typography>
                        </Stack>

                        {/* Divider */}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                my: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 1,
                                    bgcolor: "divider",
                                }}
                            />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ px: 1 }}
                            >
                                Sign in with
                            </Typography>
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 1,
                                    bgcolor: "divider",
                                }}
                            />
                        </Box>

                        {/* Google Sign-In Button */}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                mt: 1,
                            }}
                        >
                            <GoogleButton />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;
