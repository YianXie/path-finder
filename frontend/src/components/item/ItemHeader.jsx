import CategoryIcon from "@mui/icons-material/Category";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import { ItemDetailContext } from "../../contexts/ItemDetailContext";

export function ItemHeader() {
    const { state } = useContext(ItemDetailContext);

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
                    value={
                        state.itemInfo.groupRating
                            ? state.itemInfo.groupRating
                            : 2.3
                    }
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
                    {state.itemInfo.groupRating
                        ? state.itemInfo.groupRating
                        : 2.3}{" "}
                    · {state.itemInfo.numRating ? state.itemInfo.numRating : 73}{" "}
                    ratings
                </Typography>
            </Stack>

            {/* Category */}
            <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                {state.itemInfo.category?.map((cat, index) => (
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
                ))}
            </Stack>
        </>
    );
}
