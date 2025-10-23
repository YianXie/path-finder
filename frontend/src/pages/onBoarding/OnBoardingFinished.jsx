import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function OnBoardingFinished() {
    const navigate = useNavigate();

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <DoneIcon color="success" fontSize="large" />
            <Typography variant="h6">You are all set!</Typography>
            <Typography variant="body1">
                You can now start exploring the opportunities available to you.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
            >
                Start Exploring
            </Button>
        </Box>
    );
}

export default OnBoardingFinished;
