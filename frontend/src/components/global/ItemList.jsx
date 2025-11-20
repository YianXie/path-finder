import { Box, Divider, Typography } from "@mui/material";

import Item from "./Item";

function ItemList({ suggestions, name }) {
    return (
        <Box display="flex" flexDirection="column" gap={2} padding={2}>
            <Typography variant="h4" fontWeight={400} margin={1}>
                {name}
            </Typography>
            <Box
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
