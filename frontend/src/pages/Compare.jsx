import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LaunchIcon from "@mui/icons-material/Launch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../api";
import { LoadingBackdrop } from "../components/common";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useItemActions } from "../hooks";
import { usePageTitle } from "../hooks";
import { useApiError } from "../hooks";

/**
 * Compare page component - Side-by-side item comparison
 *
 * Displays two items side-by-side for detailed comparison.
 * Reads item IDs from URL query parameters (item1 and item2).
 * Shows comprehensive item information including images, ratings, categories,
 * descriptions, and save functionality. Responsive layout with vertical
 * stacking on mobile devices.
 */
function Compare() {
    usePageTitle("PathFinder | Compare");

    const [searchParams] = useSearchParams();
    const item1 = searchParams.get("item1");
    const item2 = searchParams.get("item2");
    const [item1Data, setItem1Data] = useState(null);
    const [item2Data, setItem2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [item1Saved, setItem1Saved] = useState(false);
    const [item2Saved, setItem2Saved] = useState(false);
    const { isAuthenticated } = useAuth();
    const { handleError } = useApiError();
    const { handleSave } = useItemActions();
    const navigate = useNavigate();

    useEffect(() => {
        if (!item1 || !item2) {
            navigate("/");
            handleError(new Error("Invalid item IDs"), "Invalid item IDs");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item1, item2]);

    useEffect(() => {
        async function getItemData() {
            try {
                setIsLoading(true);
                const endpoint = isAuthenticated
                    ? "suggestions-with-saved-status"
                    : "suggestions";
                const res1 = await api.get(
                    `/api/suggestions/${endpoint}/${item1}/`
                );
                const res2 = await api.get(
                    `/api/suggestions/${endpoint}/${item2}/`
                );
                setItem1Data(res1.data);
                setItem2Data(res2.data);
            } catch (error) {
                handleError(
                    error,
                    "Failed to load item data. Please try again."
                );
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        }
        if (item1 && item2) {
            getItemData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item1, item2, isAuthenticated]);

    // Sync saved state when data loads
    useEffect(() => {
        if (item1Data) {
            setItem1Saved(item1Data.is_saved ?? false);
        }
    }, [item1Data]);

    useEffect(() => {
        if (item2Data) {
            setItem2Saved(item2Data.is_saved ?? false);
        }
    }, [item2Data]);

    const handleSaveItem = async (externalId, currentIsSaved, setSaved) => {
        await handleSave(externalId, currentIsSaved, () => {
            setSaved(!currentIsSaved);
        });
    };

    const renderItemCard = (itemResponse, side, isSaved, setIsSaved) => {
        // Handle both response formats: {suggestion: {...}, is_saved: bool} or just {...}
        const item = itemResponse?.suggestion || itemResponse;

        if (!item) return null;

        return (
            <Card
                elevation={3}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Image */}
                <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                        height: 300,
                        objectFit: "cover",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(`/item/${item.external_id}`)}
                />

                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header with name and save button */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: 600,
                                flex: 1,
                                marginRight: 1,
                            }}
                        >
                            {item.name}
                        </Typography>
                        {isAuthenticated && (
                            <Tooltip
                                title={isSaved ? "Unsave item" : "Save item"}
                                placement="top"
                            >
                                <IconButton
                                    onClick={() =>
                                        handleSaveItem(
                                            item.external_id,
                                            isSaved,
                                            setIsSaved
                                        )
                                    }
                                    color="primary"
                                    size="small"
                                >
                                    {isSaved ? (
                                        <FavoriteIcon />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    {/* Rating */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ marginBottom: 2 }}
                    >
                        <Rating
                            value={item.average_rating || 0}
                            precision={0.25}
                            readOnly
                            size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                            {item.average_rating?.toFixed(1) || "0.0"}
                            {item.rate_count > 0 ? (
                                <> · {item.rate_count} rating(s)</>
                            ) : (
                                <> · No ratings yet</>
                            )}
                        </Typography>
                    </Stack>

                    {/* Categories */}
                    {item.category && item.category.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: "wrap", gap: 1 }}
                        >
                            {item.category.map((cat, index) => (
                                <Chip
                                    key={index}
                                    label={cat}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                />
                            ))}
                            {item.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                />
                            ))}
                        </Stack>
                    )}

                    <Divider sx={{ marginY: 2 }} />

                    {/* Description */}
                    {item.description && (
                        <Box sx={{ marginBottom: 2, flexGrow: 1 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ marginBottom: 1 }}
                            >
                                <DescriptionIcon
                                    color="primary"
                                    fontSize="small"
                                />
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                >
                                    Description
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.6 }}
                            >
                                {item.description}
                            </Typography>
                        </Box>
                    )}

                    {/* External link */}
                    {item.url && (
                        <Button
                            variant="outlined"
                            size="small"
                            endIcon={<LaunchIcon />}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ marginTop: "auto" }}
                        >
                            Learn More
                        </Button>
                    )}

                    {/* View Details button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/item/${item.external_id}`)}
                        sx={{ marginTop: 2 }}
                    >
                        View Full Details
                    </Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <LoadingBackdrop open={isLoading} />
            <PageHeader
                title="Compare Items"
                subtitle="Side-by-side comparison of the selected items"
                sx={{ marginBlock: 2 }}
            />
            <Container maxWidth="xl" sx={{ paddingY: 4 }}>
                {/* Back button */}
                <Box sx={{ marginBottom: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Box>

                {/* Comparison Grid */}
                {item1Data && item2Data && (
                    <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                        {/* Item 1 */}
                        <Box sx={{ flex: 1 }}>
                            {renderItemCard(
                                item1Data,
                                "left",
                                item1Saved,
                                setItem1Saved
                            )}
                        </Box>

                        {/* Divider for mobile */}
                        <Divider
                            sx={{
                                display: { xs: "block", md: "none" },
                                width: "100%",
                            }}
                        >
                            <Chip label="VS" size="small" />
                        </Divider>

                        {/* Item 2 */}
                        <Box sx={{ flex: 1 }}>
                            {renderItemCard(
                                item2Data,
                                "right",
                                item2Saved,
                                setItem2Saved
                            )}
                        </Box>
                    </Stack>
                )}
            </Container>
        </>
    );
}

export default Compare;
