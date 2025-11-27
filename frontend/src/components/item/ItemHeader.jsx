import CategoryIcon from "@mui/icons-material/Category";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useItemDetail } from "../../contexts/ItemDetailContext";

/**
 * ItemHeader component - Header section of item detail card
 *
 * Displays the item name, average rating with review count, and category chips.
 * Uses Material-UI Typography and Rating components for consistent styling.
 */
export function ItemHeader() {
    const { state } = useItemDetail();

    return (
        <>
            {/* Name */}
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 500,
                    marginBottom: 2,
                }}
            >
                {state.itemInfo.name}
            </Typography>

            {/* Rating horizontal stack */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ marginBottom: 3 }}
            >
                {/* Rating stars */}
                <Rating
                    name="simple-controlled"
                    value={state.averageRating}
                    precision={0.25}
                    readOnly
                />

                {/* Rating numbers and number of reviews*/}
                <Typography
                    component="p"
                    color="textDisabled"
                    sx={{
                        fontWeight: 500,
                        marginBottom: 2,
                    }}
                >
                    {state.averageRating.toFixed(1)}
                    {state.numRatings > 0 ? (
                        <> · {state.numRatings} rating(s)</>
                    ) : (
                        <> · No ratings yet</>
                    )}
                </Typography>
            </Stack>

            {/* Category */}
            <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                {state.itemInfo.category?.map((cat, index) => (
                    <Chip
                        key={index}
                        color="primary"
                        label={cat}
                        variant="outlined"
                        size="small"
                        sx={{
                            padding: 1,
                        }}
                    />
                ))}
                {state.itemInfo.tags?.map((tag, index) => (
                    <Chip
                        key={index}
                        color="secondary"
                        label={tag}
                        variant="outlined"
                        size="small"
                        sx={{
                            padding: 1,
                        }}
                    />
                ))}
            </Stack>
        </>
    );
}
