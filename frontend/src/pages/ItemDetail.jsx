import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api";
import { LoadingBackdrop } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useItemActions } from "../hooks";
import usePageTitle from "../hooks/usePageTitle";

/**
 * ItemDetail component for displaying detailed information about a specific item
 *
 * Shows comprehensive item information including image, description, categories,
 * and external links. Provides save/unsave and share functionality.
 * Handles loading states and error conditions gracefully.
 */
function ItemDetail() {
    usePageTitle("PathFinder | Item Detail");

    const navigate = useNavigate();

    const { external_id } = useParams();
    const { access } = useAuth();
    const { handleSave, handleShare, handleRating } = useItemActions();

    const [itemInfo, setItemInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);

    /**
     * Fetches item information from the API
     * Uses different endpoints based on authentication status
     */
    useEffect(() => {
        async function getItemInfo() {
            try {
                setIsLoading(true);
                setError(null);

                // Use different endpoints based on authentication status
                // Authenticated users get saved status, anonymous users don't
                const endpoint = access
                    ? `/api/suggestions-with-saved-status/${external_id}/`
                    : `/api/suggestions/${external_id}`;

                const response = await api.get(endpoint);

                setItemInfo(response.data.suggestion);
                setIsSaved(response.data.is_saved);
                // Removed untl backend is implemented
                // setIsSaved(response.data.rating);
            } catch (error) {
                console.error("Failed to fetch item info:", error);
                setError("Failed to load item details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        getItemInfo();
    }, [external_id, access]);

    /**
     * Handles saving/unsaving the item with optimistic UI design
     */
    const onSave = async () => {
        // I change the UI before I send the requests
        setIsSaved(!isSaved);
        try {
            // If the requests succeeds than nothing happens
            await handleSave(external_id, isSaved, () => {});
        } catch {
            // But if it fails we toggle back the current value to make sure we have the correct value
            setIsSaved((prev) => !prev);
        }
    };

    /**
     * Handles sharing the current page URL
     */
    const onShare = async () => {
        await handleShare(window.location.href);
    };

    /**
     * Handles User Rating changes
     */

    const onRating = async (e, newRating) => {
        setRating(newRating);
        // // To be implemented
        if (1 + 1 == 3) {
            await handleRating(external_id, newRating, () => {
                setRating(newRating);
            });
        }
    };

    /**
     * Opens the external link in a new tab
     */
    const handleExternalLink = () => {
        if (itemInfo?.url) {
            window.open(itemInfo.url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ paddingBlock: 4 }}>
            <LoadingBackdrop open={isLoading} />

            {/* Back navigation button */}
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ marginBottom: 2 }}
                >
                    Back
                </Button>
            </Box>

            {/* Error display */}
            {error && (
                <Alert severity="error" sx={{ marginBottom: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Main item content */}
            {itemInfo && (
                <Card elevation={2}>
                    <Grid container spacing={0}>
                        {/* Item image section */}
                        <Grid padding={2}>
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

                        {/* Item content section */}
                        <Grid>
                            <CardContent
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Item header with title, categories, and action buttons */}
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
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ marginBottom: 3 }}
                                    >
                                        <Rating
                                            name="simple-controlled"
                                            value={
                                                itemInfo.groupRating
                                                    ? itemInfo.groupRating
                                                    : 2.3
                                            }
                                            precision={0.25}
                                            readOnly
                                        />
                                        <Typography
                                            component="p"
                                            color="textDisabled"
                                            sx={{
                                                fontWeight: 500,
                                                marginBottom: 2,
                                            }}
                                        >
                                            {itemInfo.groupRating
                                                ? itemInfo.groupRating
                                                : 2.3}{" "}
                                            ·{" "}
                                            {itemInfo.numRating
                                                ? itemInfo.numRating
                                                : 73}{" "}
                                            ratings
                                        </Typography>
                                    </Stack>

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
                                                onClick={onSave}
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
                                                onClick={onShare}
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
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Tooltip
                                                title="Rate this item"
                                                placement="bottom"
                                            >
                                                <Rating
                                                    name="simple-controlled"
                                                    value={rating}
                                                    onChange={onRating}
                                                />
                                            </Tooltip>
                                        </Box>
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
