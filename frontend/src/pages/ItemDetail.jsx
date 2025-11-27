import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api";
import { LoadingBackdrop } from "../components/common";
import { ItemDetailCard } from "../components/item/ItemDetailCard";
import { useAuth } from "../contexts/AuthContext";
import { useItemDetail } from "../contexts/ItemDetailContext";
import usePageTitle from "../hooks/usePageTitle";

/**
 * ItemDetail component for displaying detailed information about a specific item
 *
 * Fetches and displays comprehensive item information including image, description,
 * categories, ratings, and external links. Provides save/unsave and share functionality.
 * Uses different API endpoints based on authentication status to include saved status.
 * Handles loading states and error conditions gracefully with user-friendly messages.
 */
function ItemDetail() {
    usePageTitle("PathFinder | Item Detail");

    const { state, setters } = useItemDetail();
    const { external_id } = useParams();
    const { isAuthenticated } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function getItemInfo() {
            try {
                setters.setIsLoading(true);
                setters.setError(null);

                // Use different endpoints based on authentication status
                // Authenticated users get saved status, anonymous users don't
                const endpoint = isAuthenticated
                    ? `/api/suggestions/suggestions-with-saved-status/${external_id}/`
                    : `/api/suggestions/suggestions/${external_id}`;

                const response = await api.get(endpoint);

                console.log(response.data);

                setters.setItemInfo(response.data.suggestion);
                setters.setIsSaved(response.data.is_saved);
                setters.setAverageRating(
                    response.data.suggestion.average_rating
                );
                setters.setNumRatings(response.data.suggestion.rate_count);
            } catch (error) {
                console.error("Failed to fetch item info:", error);
                setters.setError(
                    "Failed to load item details. Please try again."
                );
            } finally {
                setters.setIsLoading(false);
            }
        }
        getItemInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [external_id, isAuthenticated, refreshKey]);

    if (state.error) {
        return (
            <Alert severity="error" sx={{ marginBottom: 3 }}>
                {state.error}
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ paddingBlock: 4 }}>
            <LoadingBackdrop open={state.isLoading} />

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

            {/* Main item content */}
            {state.itemInfo && (
                <ItemDetailCard
                    external_id={external_id}
                    refreshKey={refreshKey}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </Container>
    );
}

export default ItemDetail;
