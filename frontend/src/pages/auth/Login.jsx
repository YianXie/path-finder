import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
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
    const { isAuthenticated, login, fetchUserProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await api.post("/api/token/", {
                username: username,
                password: password,
            });
            const { access, refresh } = response.data;
            const profile = await fetchUserProfile(access);
            await login({ access, refresh }, profile);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 200px)",
                py: 4,
            }}
        >
            <Card
                elevation={4}
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
            <Divider sx={{ width: "100%", my: 4 }}>
                Or login as an admin
            </Divider>
            <Card
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: 3,
                    overflow: "visible",
                    padding: { xs: 1, sm: 2 },
                    alignItems: "center",
                }}
            >
                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onSubmit={handleSubmit}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: "100%",
                        }}
                    >
                        <AccountCircle sx={{ color: "action.active", mr: 1 }} />
                        <TextField
                            label="Username"
                            name="username"
                            variant="standard"
                            fullWidth
                            type="text"
                            required
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: "100%",
                        }}
                    >
                        <LockIcon sx={{ color: "action.active", mr: 1 }} />
                        <TextField
                            label="Password"
                            name="password"
                            variant="standard"
                            fullWidth
                            type="password"
                            required
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Card>
        </Container>
    );
}

export default Login;
