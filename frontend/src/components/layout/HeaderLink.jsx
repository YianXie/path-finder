import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

/**
 * HeaderLink component for navigation links in the header
 *
 * Wraps Material-UI Link component with React Router's Link for client-side navigation.
 * Provides consistent styling and behavior for header navigation links.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Link text/content
 * @param {string} props.to - Route path to navigate to
 * @param {string} props.underline - Underline style ("hover", "always", "none")
 * @param {...any} props.props - Additional props passed to Material-UI Link
 */
function HeaderLink({ children, to, underline = "hover", ...props }) {
    return (
        <Link component={RouterLink} underline={underline} to={to} {...props}>
            {children}
        </Link>
    );
}

export default HeaderLink;
