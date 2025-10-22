import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

function OnBoarding() {
    const steps = ["Basic Information", "Interests", "Skills & Goals"];
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
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
        <Container maxWidth="xl">
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
                {steps.map((step) => (
                    <Step>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 && (
                <Box>
                    <Typography variant="h6">Step {activeStep + 1}</Typography>
                </Box>
            )}
            {activeStep === 1 && (
                <Box>
                    <Typography variant="h6">Step {activeStep + 1}</Typography>
                </Box>
            )}
            {activeStep === 2 && (
                <Box>
                    <Typography variant="h6">Step {activeStep + 1}</Typography>
                </Box>
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
        </Container>
    );
}

export default OnBoarding;
