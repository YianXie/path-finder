import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";

function Step1({ basicInformation, setBasicInformation }) {
    const subjectOptions = [
        {
            label: "Math",
            value: "math",
        },
        {
            label: "Science",
            value: "science",
        },
        {
            label: "English",
            value: "english",
        },
        {
            label: "Social Studies",
            value: "socialStudies",
        },
        {
            label: "World Language",
            value: "worldLanguage",
        },
        {
            label: "Arts",
            value: "arts",
        },
        {
            label: "Physical Education",
            value: "physicalEducation",
        },
        {
            label: "Other",
            value: "other",
        },
    ];
    const gradeOptions = [
        {
            label: "9 (Freshman)",
            value: "9",
        },
        {
            label: "10 (Sophomore)",
            value: "10",
        },
        {
            label: "11 (Junior)",
            value: "11",
        },
        {
            label: "12 (Senior)",
            value: "12",
        },
    ];

    const handleChange = (event) => {
        setBasicInformation({ ...basicInformation, role: event.target.value });
    };

    const handleGradeChange = (event) => {
        setBasicInformation({ ...basicInformation, grade: event.target.value });
    };

    const handleSubjectChange = (event) => {
        setBasicInformation({
            ...basicInformation,
            subject: event.target.value,
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                gap: 4,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
            }}
        >
            <FormControl sx={{ display: "flex", gap: 2 }}>
                <FormLabel>What is your role?</FormLabel>
                <RadioGroup
                    value={basicInformation.role}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="student"
                        control={<Radio />}
                        label="Student"
                    />
                    <FormControlLabel
                        value="teacher"
                        control={<Radio />}
                        label="Teacher"
                    />
                    <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                    />
                </RadioGroup>
            </FormControl>
            {basicInformation.role === "student" && (
                <FormControl sx={{ display: "flex", gap: 2 }}>
                    <FormLabel>What is your grade level?</FormLabel>
                    <Select
                        value={basicInformation.grade}
                        onChange={handleGradeChange}
                    >
                        {gradeOptions.map((grade) => (
                            <MenuItem key={grade.value} value={grade.value}>
                                {grade.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {basicInformation.role === "teacher" && (
                <FormControl sx={{ display: "flex", gap: 2 }}>
                    <FormLabel>What is your subject?</FormLabel>
                    <Select
                        value={basicInformation.subject}
                        onChange={handleSubjectChange}
                    >
                        {subjectOptions.map((subject) => (
                            <MenuItem key={subject.value} value={subject.value}>
                                {subject.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}

export default Step1;
