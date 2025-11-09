import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";

import { ItemDetailContext } from "../../contexts/ItemDetailContext";
import { ItemActions } from "./ItemActions";
import { ItemDescription } from "./ItemDescription";
import { ItemHeader } from "./ItemHeader";
import { ItemImage } from "./ItemImage";
import RateItem from "./RateItem";

export function ItemDetailCard() {
    const { state } = useContext(ItemDetailContext);
    const [isRateItemOpen, setIsRateItemOpen] = useState(false);

    /**
     * Opens the external link in a new tab
     */
    const handleExternalLink = () => {
        if (state.itemInfo?.url) {
            window.open(state.itemInfo.url, "_blank", "noopener,noreferrer");
        }
    };

    const handleRateItem = () => {
        setIsRateItemOpen(true);
    };

    return (
        <Card elevation={2}>
            <Grid container spacing={0}>
                {/* Item image section */}
                <ItemImage />

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
                            <ItemHeader />
                            <ItemActions />
                        </Box>

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
                                <Typography variant="body1" fontWeight={500}>
                                    Leave a review
                                </Typography>
                            </Stack>
                        </Button>

                        <Divider sx={{ marginY: 2 }} />

                        {/* Description */}
                        {state.itemInfo.description && <ItemDescription />}

                        {/* External Link */}
                        {state.itemInfo.url && (
                            <Box sx={{ marginBottom: 3 }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ marginBottom: 1 }}
                                >
                                    <LinkIcon color="primary" />
                                    <Typography variant="h6" component="h2">
                                        External Link
                                    </Typography>
                                </Stack>
                                <Link
                                    href={state.itemInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        wordBreak: "break-all",
                                        display: "block",
                                        marginBottom: 1,
                                    }}
                                >
                                    {state.itemInfo.url}
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
            <RateItem
                open={isRateItemOpen}
                onClose={() => setIsRateItemOpen(false)}
            />
        </Card>
    );
}
