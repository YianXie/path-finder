import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";

import Item from "./Item";

function ItemList({ suggestions, name }) {
    const itemListRef = useRef(null);

    useEffect(() => {
        if (itemListRef.current && suggestions.length > 0) {
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
                if (itemListRef.current) {
                    itemListRef.current.scrollLeft = 50;
                }
            });
        }
    }, [suggestions]);

    return (
        <Box display="flex" flexDirection="column" gap={2} padding={2}>
            <Typography variant="h4" fontWeight={400} margin={1}>
                {name}
            </Typography>
            <Box
                ref={itemListRef}
                sx={{
                    display: "flex",
                    overflowX: "auto", // allow horizontal scroll inside this box
                    gap: 2,
                    width: "100%",
                    scrollbarWidth: "none",
                }}
            >
                {[...suggestions].map(
                    (suggestion, index) =>
                        suggestion && (
                            <Box
                                sx={{ flex: "0 0 auto", padding: 1 }}
                                key={`${suggestion.external_id}-${index}`}
                            >
                                <Item {...suggestion} />
                            </Box>
                        )
                )}
            </Box>
        </Box>
    );
}

export default ItemList;
