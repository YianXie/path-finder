import DescriptionIcon from "@mui/icons-material/Description";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useItemDetail } from "../../contexts/ItemDetailContext";

export function ItemDescription() {
    const { state } = useItemDetail();

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ marginBottom: 1 }}
            >
                <DescriptionIcon color="primary" />
                <Typography variant="h6" component="h2">
                    Description
                </Typography>
            </Stack>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
            >
                {state.itemInfo.description}
            </Typography>
        </Box>
    );
}
