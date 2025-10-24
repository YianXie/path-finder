import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

/**
 * Page header component for consistent page titles and subtitles
 *
 * Provides a standardized header layout for pages with optional subtitle.
 * Uses Material-UI Typography components for consistent styling.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main page title
 * @param {string} props.subtitle - Optional subtitle text
 * @param {string} props.className - Additional CSS classes
 */
function PageHeader({ title, subtitle, className = "" }) {
    return (
        <Container maxWidth="xl" className={className}>
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h3" fontWeight={500}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="h6" fontWeight={400}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Divider sx={{ marginTop: 2 }} />
        </Container>
    );
}

export default PageHeader;
