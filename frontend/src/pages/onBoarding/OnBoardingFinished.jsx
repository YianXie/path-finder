import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import LoadingBackdrop from "../../components/common/LoadingBackdrop";

function OnBoardingFinished({
    basicInformation,
    interests,
    goals,
    otherGoals,
}) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function updateUserInformation() {
            try {
                setIsLoading(true);
                api.post("/accounts/update-user-information/", {
                    basic_information: basicInformation,
                    interests: interests,
                    goals: goals,
                    other_goals: otherGoals,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        updateUserInformation();
    }, [basicInformation, interests, goals, otherGoals]);

    return (
        <>
            <LoadingBackdrop open={isLoading} />
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
                    You can now start exploring the opportunities available to
                    you.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/")}
                >
                    Start Exploring
                </Button>
            </Box>
        </>
    );
}

export default OnBoardingFinished;
