import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { useContext } from "react";

import { ItemDetailContext } from "../../contexts/ItemDetailContext";

export function ItemImage() {
    const { state } = useContext(ItemDetailContext);

    return (
        <Grid padding={2} width="100%">
            <CardMedia
                component="img"
                image={state.itemInfo.image}
                alt={state.itemInfo.name}
                sx={{
                    height: { xs: 250, md: 400 },
                    objectFit: "cover",
                    width: "100%",
                    backgroundColor: "grey.100",
                    cursor: "pointer",
                    transition: "transform 0.3s ease-in-out",
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
