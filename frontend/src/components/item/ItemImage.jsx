import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

import { useItemDetail } from "../../contexts/ItemDetailContext";

/**
 * ItemImage component - Image display for item detail page
 *
 * Displays the item's main image with responsive sizing.
 * Includes hover effects (scale on hover) and click handler to open image in new tab.
 * Handles image loading errors gracefully by hiding broken images.
 */
export function ItemImage() {
    const { state } = useItemDetail();

    return (
        <Grid padding={2} width="100%">
            <CardMedia
                component="img"
                image={state.itemInfo.image}
                alt={state.itemInfo.name}
                draggable={false}
                sx={{
                    height: { xs: 250, md: 400 },
                    objectFit: "cover",
                    width: "100%",
                    backgroundColor: "grey.100",
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
                    userSelect: "none",
                }}
                onClick={() => {
                    window.open(state.itemInfo.image, "_blank");
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                }}
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />
        </Grid>
    );
}
