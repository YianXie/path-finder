import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

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
