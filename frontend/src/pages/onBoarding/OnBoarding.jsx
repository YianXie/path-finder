import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";
import usePageTitle from "../../hooks/usePageTitle";
import OnBoardingFinished from "./OnBoardingFinished";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

function OnBoarding() {
    usePageTitle("PathFinder | Onboarding");

    const { user } = useAuth();
    const steps = ["Basic Information", "Interests", "Goals"];
    const [basicInformation, setBasicInformation] = useState(
        user.basic_information
            ? user.basic_information
            : {
                  role: "student",
                  grade: "",
                  subject: "",
              }
    );
    const [interests, setInterests] = useState(
        user.interests && user.interests.length > 0 ? user.interests : []
    );
    const [goals, setGoals] = useState(
        user.goals && user.goals.length > 0 ? user.goals : []
    );
    const [otherGoals, setOtherGoals] = useState(
        user.other_goals && user.other_goals.length > 0 ? user.other_goals : ""
    );
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const { setSnackBar } = useSnackBar();

    useEffect(() => {
        console.log(user);
    }, [user]);

    const isStepOptional = (step) => {
        return step === 2;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        if (activeStep === 1 && interests.length < 1) {
            setSnackBar((prev) => ({
                ...prev,
                open: true,
                message: "You must select at least 1 interest",
                severity: "warning",
            }));
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    return (
        <Container
            maxWidth="lg"
            sx={{ display: "flex", flexDirection: "column" }}
        >
            <Box
                display="flex"
                gap={1}
                flexDirection="column"
                alignItems="center"
                sx={{ textAlign: "center", marginTop: 2, marginBottom: 4 }}
            >
                <Typography variant="h3">Welcome to PathFinder!</Typography>
                <Typography variant="body1">
                    We'll help you find the perfect opportunities for you.
                </Typography>
            </Box>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => {
                    const labelProps = {};
                    const stepProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step {...stepProps}>
                            <StepLabel {...labelProps}>{step}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === 0 && (
                <Step1
                    basicInformation={basicInformation}
                    setBasicInformation={setBasicInformation}
                />
            )}
            {activeStep === 1 && (
                <Step2 interests={interests} setInterests={setInterests} />
            )}
            {activeStep === 2 && (
                <Step3
                    goals={goals}
                    setGoals={setGoals}
                    otherGoals={otherGoals}
                    setOtherGoals={setOtherGoals}
                />
            )}
            {activeStep === 3 && (
                <OnBoardingFinished
                    basicInformation={basicInformation}
                    interests={interests}
                    goals={goals}
                    otherGoals={otherGoals}
                />
            )}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop={4}
                marginBottom={2}
            >
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                >
                    Back
                </Button>
                <Box>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={handleSkip}
                        disabled={!isStepOptional(activeStep)}
                    >
                        Skip
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={activeStep === steps.length}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
            <Stack alignItems="center" marginTop={4} marginBottom={2} gap={1}>
                <Typography variant="body1" textAlign={"center"}>
                    Your data will be used to personalize your recommendations.
                </Typography>
                <Typography variant="body2" textAlign={"center"}>
                    You can always update your information later.
                </Typography>
            </Stack>
        </Container>
    );
}

export default OnBoarding;
