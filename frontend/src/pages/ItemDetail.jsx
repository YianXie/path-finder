// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useSnackBar } from "../contexts/SnackBarContext";
import usePageTitle from "../hooks/usePageTitle";

function ItemDetail() {
    usePageTitle("PathFinder | Item Detail");

    const navigate = useNavigate();

    const { external_id } = useParams();
    const { access } = useAuth();
    const { snackBar, setSnackBar } = useSnackBar();

    const [itemInfo, setItemInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getItemInfo() {
            try {
                setIsLoading(true);
                setError(null);

                // Try to get item with saved status for authenticated users
                const endpoint = access
                    ? `/api/suggestions-with-saved-status/${external_id}/`
                    : `/api/suggestions/${external_id}`;

                const response = await api.get(endpoint);

                setItemInfo(response.data.suggestion);
                setIsSaved(response.data.is_saved);
            } catch (error) {
                console.error("Failed to fetch item info:", error);
                setError("Failed to load item details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        getItemInfo();
    }, [external_id, access]);

    const handleSave = async () => {
        if (!access) {
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: "Please login to save items",
            });
            return;
        }

        try {
            await api.post("/accounts/save-item/", {
                external_id: external_id,
            });

            setSnackBar({
                ...snackBar,
                open: true,
                severity: "success",
                message: `Item ${isSaved ? "removed from" : "saved to"} your profile`,
            });

            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Failed to save item:", error);
            setSnackBar({
                ...snackBar,
                severity: "error",
                open: true,
                message: "Failed to save item: " + error.message,
            });
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "success",
                message: "Link copied to clipboard",
            });
        } catch (error) {
            console.error("Failed to copy link:", error);
            setSnackBar({
                ...snackBar,
                severity: "error",
                open: true,
                message: "Failed to copy link: " + error.message,
            });
        }
    };

    const handleExternalLink = () => {
        if (itemInfo?.url) {
            window.open(itemInfo.url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ paddingBlock: 4 }}>
            <Backdrop
                open={isLoading}
                sx={(theme) => ({
                    zIndex: theme.zIndex.drawer + 1,
                    color: "#fff",
                })}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Navigation */}
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ marginBottom: 2 }}
                >
                    Back
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ marginBottom: 3 }}>
                    {error}
                </Alert>
            )}

            {itemInfo && (
                <Card elevation={2}>
                    <Grid container spacing={0}>
                        {/* Image Section */}
                        <Grid item xs={12} md={6} padding={2}>
                            <CardMedia
                                component="img"
                                image={itemInfo.image}
                                alt={itemInfo.name}
                                sx={{
                                    height: { xs: 250, md: 400 },
                                    objectFit: "cover",
                                    backgroundColor: "grey.100",
                                }}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </Grid>

                        {/* Content Section */}
                        <Grid item xs={12} md={6}>
                            <CardContent
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Header with title and actions */}
                                <Box sx={{ marginBottom: 3 }}>
                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 500,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {itemInfo.name}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {itemInfo.category?.map(
                                            (cat, index) => (
                                                <Chip
                                                    key={index}
                                                    icon={<CategoryIcon />}
                                                    label={cat}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        padding: 1,
                                                    }}
                                                />
                                            )
                                        )}
                                    </Stack>

                                    {/* Action buttons */}
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <Tooltip
                                            title={
                                                isSaved
                                                    ? "Remove from saved"
                                                    : "Save item"
                                            }
                                            placement="bottom"
                                        >
                                            <IconButton
                                                onClick={handleSave}
                                                color="primary"
                                                aria-label={
                                                    isSaved
                                                        ? "Remove from saved"
                                                        : "Save item"
                                                }
                                            >
                                                {isSaved ? (
                                                    <FavoriteIcon />
                                                ) : (
                                                    <FavoriteBorderIcon />
                                                )}
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip
                                            title="Share"
                                            placement="bottom"
                                        >
                                            <IconButton
                                                onClick={handleShare}
                                                color="primary"
                                                aria-label="Share"
                                            >
                                                <ShareIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {itemInfo.url && (
                                            <Tooltip
                                                title="Open external link"
                                                placement="bottom"
                                            >
                                                <IconButton
                                                    onClick={handleExternalLink}
                                                    color="primary"
                                                    aria-label="Open external link"
                                                >
                                                    <OpenInNewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </Box>

                                <Divider sx={{ marginY: 2 }} />

                                {/* Description */}
                                {itemInfo.description && (
                                    <Box sx={{ marginBottom: 3 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            sx={{ marginBottom: 1 }}
                                        >
                                            <DescriptionIcon color="primary" />
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                            >
                                                Description
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            {itemInfo.description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* External Link */}
                                {itemInfo.url && (
                                    <Box sx={{ marginBottom: 3 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            sx={{ marginBottom: 1 }}
                                        >
                                            <LinkIcon color="primary" />
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                            >
                                                External Link
                                            </Typography>
                                        </Stack>
                                        <Link
                                            href={itemInfo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                wordBreak: "break-all",
                                                display: "block",
                                                marginBottom: 1,
                                            }}
                                        >
                                            {itemInfo.url}
                                        </Link>
                                        <Button
                                            variant="contained"
                                            startIcon={<OpenInNewIcon />}
                                            onClick={handleExternalLink}
                                            sx={{ marginTop: 1 }}
                                        >
                                            Visit Website
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            )}
        </Container>
    );
}

export default ItemDetail;
