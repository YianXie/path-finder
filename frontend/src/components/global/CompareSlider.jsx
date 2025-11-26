import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

function CompareSlider({ selectedItems, handleCompare }) {
    return (
        <Slide direction="up" in={selectedItems.length > 0}>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 2,
                    backgroundColor: "primary.main",
                    boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 999,
                }}
            >
                <Typography variant="h6" color="primary.contrastText">
                    Compare Items
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={selectedItems.length < 2}
                    onClick={handleCompare}
                >
                    Compare
                </Button>
            </Box>
        </Slide>
    );
}

export default CompareSlider;
