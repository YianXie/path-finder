import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

/**
 * AboutSection component - Individual section in the About page
 *
 * Displays a single information section with title and description.
 * Includes fade-in animation with configurable delay for staggered appearance.
 * Uses Material-UI Paper component with gradient text effects.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description text
 * @param {number} props.delay - Animation delay in milliseconds (default: 0)
 */
function AboutSection({ title, description, delay = 0 }) {
    const theme = useTheme();

    return (
        <Fade in timeout={800 + delay}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box display="flex" flexDirection="column" gap={3}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                        sx={{
                            fontWeight: 600,
                            background: theme.palette.primary.main,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{
                            lineHeight: 1.8,
                            color: theme.palette.text.secondary,
                            fontSize: "1.2rem",
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
}

/**
 * About page component - Information about PathFinder
 *
 * Displays information about the PathFinder application, its purpose,
 * and how to use it. Uses a grid layout with animated sections that
 * fade in with staggered delays for visual appeal.
 */
function About() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
            }}
        >
            <Container
                sx={{
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Fade in timeout={600}>
                    <Box textAlign="center" mb={2}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 2,
                            }}
                        >
                            About PathFinder
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontWeight: 400,
                                maxWidth: "600px",
                                mx: "auto",
                            }}
                        >
                            Discover your path to success
                        </Typography>
                    </Box>
                </Fade>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)",
                        },
                        gap: 4,
                        width: "100%",
                        maxWidth: "1200px",
                    }}
                >
                    <AboutSection
                        title="Who are we?"
                        description="We are a team of students who are passionate about helping high school students find their passions and pursue their dreams."
                        delay={0}
                    />
                    <AboutSection
                        title="What is PathFinder?"
                        description="PathFinder is a web application designed to provide personalized suggestions for SAS high school students on competitions, clubs, and tutoring based on their interests, skills, and goals."
                        delay={100}
                    />
                    <AboutSection
                        title="How does PathFinder work?"
                        description="PathFinder works by using a combination of machine learning (future implementation) and natural language processing to provide personalized suggestions for SAS high school students on competitions, clubs, and tutoring based on their interests, skills, and goals. Currently, PathFinder is a work in progress and is not yet fully functional."
                        delay={200}
                    />
                    <AboutSection
                        title="Why did we create PathFinder?"
                        description="We created PathFinder because we wanted to help high school students find their passions and pursue their dreams."
                        delay={300}
                    />
                    <AboutSection
                        title="Who can use PathFinder?"
                        description="Any SAS students, teachers, counselors, and parents are welcome to use PathFinder."
                        delay={400}
                    />
                    <AboutSection
                        title="How can I use PathFinder?"
                        description="You can use PathFinder by creating an account and then using the site to find competitions, clubs, and tutoring based on your interests, skills, and goals."
                        delay={500}
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default About;
