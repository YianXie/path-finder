import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { useState } from "react";

import { useItemDetail } from "../../contexts/ItemDetailContext";
import { ItemActions } from "./ItemActions";
import ItemComments from "./ItemComments";
import { ItemDescription } from "./ItemDescription";
import { ItemHeader } from "./ItemHeader";
import { ItemImage } from "./ItemImage";
import RateItem from "./RateItem";

/**
 * ItemDetailCard component - Main card container for item detail page
 *
 * Combines all item detail components into a single card layout.
 * Manages the rate item dialog state and coordinates data refresh.
 * Displays item image, header, actions, description, and comments.
 *
 * @param {Object} props - Component props
 * @param {string} props.external_id - Unique identifier for the item
 * @param {number} props.refreshKey - Key used to trigger data refresh
 * @param {Function} props.setRefreshKey - Function to update refresh key
 */
export function ItemDetailCard({ external_id, refreshKey, setRefreshKey }) {
    const { state } = useItemDetail();
    const [isRateItemOpen, setIsRateItemOpen] = useState(false);

    const handleRateItem = () => {
        setIsRateItemOpen(true);
    };

    return (
        <>
            <Card elevation={2}>
                <Grid container spacing={0}>
                    {/* Item image section */}
                    <ItemImage />

                    {/* Item content section */}
                    <Grid width={1}>
                        <CardContent
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Item header with title, categories, and action buttons */}
                            <Box>
                                <ItemHeader />
                                <ItemActions handleRateItem={handleRateItem} />
                            </Box>

                            <Divider sx={{ marginY: 2 }} />

                            {/* Description */}
                            {state.itemInfo.description && <ItemDescription />}
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
            <ItemComments external_id={external_id} refreshKey={refreshKey} />
            <RateItem
                open={isRateItemOpen}
                onClose={() => setIsRateItemOpen(false)}
                external_id={external_id}
                onSubmitted={() => setRefreshKey((prev) => prev + 1)}
            />
        </>
    );
}
