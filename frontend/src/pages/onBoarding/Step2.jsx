import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { useSnackBar } from "../../contexts/SnackBarContext";

function Step2({ interests, setInterests }) {
    const interestOptions = [
        {
            label: "Mathematics",
            value: "mathematics",
        },
        {
            label: "Science",
            value: "science",
        },
        {
            label: "Computer Science",
            value: "computerScience",
        },
        {
            label: "Engineering",
            value: "engineering",
        },
        {
            label: "Arts",
            value: "arts",
        },
        {
            label: "Social Studies",
            value: "socialStudies",
        },
        {
            label: "Health and Physical Education",
            value: "healthAndPhysicalEducation",
        },
        {
            label: "History",
            value: "history",
        },
        {
            label: "World Languages",
            value: "worldLanguages",
        },
        {
            label: "Business",
            value: "business",
        },
        {
            label: "Other",
            value: "other",
        },
    ];

    const [error, setError] = useState(false);
    const { setSnackBar } = useSnackBar();

    const handleInterestChange = (event) => {
        setError(false);
        if (!interests.includes(event.target.value) && interests.length < 3) {
            setInterests([...interests, event.target.value]);
        } else if (interests.includes(event.target.value)) {
            if (interests.length <= 1) {
                setSnackBar((prev) => ({
                    ...prev,
                    open: true,
                    message: "You must select at least 1 interest",
                    severity: "warning",
                }));
                setError(true);
            }
            setInterests(
                interests.filter((interest) => interest !== event.target.value)
            );
        } else {
            setSnackBar((prev) => ({
                ...prev,
                open: true,
                message: "You can only select up to 3 interests",
                severity: "warning",
            }));
        }
    };

    useEffect(() => {
        console.log(interests);
    }, [interests]);

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Typography variant="h6">Step 2</Typography>
            <FormControl error={error}>
                <FormLabel>What are your interests? (1-3)</FormLabel>
                <FormGroup>
                    {interestOptions.map((interest) => (
                        <FormControlLabel
                            key={interest.label}
                            control={
                                <Checkbox
                                    onChange={handleInterestChange}
                                    value={interest.label}
                                    checked={interests.includes(interest.label)}
                                />
                            }
                            label={interest.label}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Box>
    );
}

export default Step2;
