import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

/**
 * Step3 component - Goals selection step (optional)
 *
 * Allows users to select their main goals (competitions, clubs, tutoring, other).
 * Includes an optional text field for additional comments or goals.
 * This step can be skipped by users.
 *
 * @param {Object} props - Component props
 * @param {Array<string>} props.goals - Current selected goals array
 * @param {Function} props.setGoals - Function to update goals array
 * @param {string} props.otherGoals - Additional goals/comments text
 * @param {Function} props.setOtherGoals - Function to update other goals text
 */
function Step3({ goals, setGoals, otherGoals, setOtherGoals }) {
    const goalOptions = [
        {
            label: "Competitions",
            value: "competitions",
        },
        {
            label: "Clubs",
            value: "clubs",
        },
        {
            label: "Tutoring",
            value: "tutoring",
        },
        {
            label: "Other",
            value: "other",
        },
    ];

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
            padding={2}
        >
            <FormControl>
                <FormLabel>What is your main goal?</FormLabel>
                <FormGroup>
                    {goalOptions.map((goal) => (
                        <FormControlLabel
                            key={goal.value}
                            control={
                                <Checkbox
                                    checked={goals.includes(goal.value)}
                                    onChange={(e) =>
                                        setGoals(
                                            e.target.checked
                                                ? [...goals, goal.value]
                                                : goals.filter(
                                                      (g) => g !== goal.value
                                                  )
                                        )
                                    }
                                />
                            }
                            label={goal.label}
                        />
                    ))}
                </FormGroup>
            </FormControl>
            <TextField
                label="Anything else you want to add/tell us? (Optional)"
                multiline
                rows={4}
                sx={{ width: "40rem", marginTop: 2 }}
                placeholder="e.g. I want to focus on both Math and Computer Science"
                value={otherGoals}
                onChange={(e) => setOtherGoals(e.target.value)}
            />
        </Box>
    );
}

export default Step3;
