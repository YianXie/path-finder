import RateReviewIcon from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useItemDetail } from "../../contexts/ItemDetailContext";
import { ItemActions } from "./ItemActions";
import ItemComments from "./ItemComments";
import { ItemDescription } from "./ItemDescription";
import { ItemHeader } from "./ItemHeader";
import { ItemImage } from "./ItemImage";
import RateItem from "./RateItem";

export function ItemDetailCard({ external_id }) {
    const { state } = useItemDetail();
    const [isRateItemOpen, setIsRateItemOpen] = useState(false);
    const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
    const { access } = useAuth();

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
                            <Box sx={{ marginBottom: 3 }}>
                                <ItemHeader />
                                <ItemActions />
                            </Box>

                            {access && (
                                <Button
                                    color="primary"
                                    sx={{ width: "fit-content" }}
                                    onClick={handleRateItem}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <RateReviewIcon color="primary" />
                                        <Typography
                                            variant="body1"
                                            fontWeight={500}
                                        >
                                            Write a review
                                        </Typography>
                                    </Stack>
                                </Button>
                            )}

                            <Divider sx={{ marginY: 2 }} />

                            {/* Description */}
                            {state.itemInfo.description && <ItemDescription />}
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
            <ItemComments
                external_id={external_id}
                refreshKey={reviewsRefreshKey}
            />
            <RateItem
                open={isRateItemOpen}
                onClose={() => setIsRateItemOpen(false)}
                external_id={external_id}
                onSubmitted={() => setReviewsRefreshKey((k) => k + 1)}
            />
        </>
    );
}
