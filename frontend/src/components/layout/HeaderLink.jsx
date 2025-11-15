import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function HeaderLink({ children, to, underline = "hover", ...props }) {
    return (
        <Link component={RouterLink} underline={underline} to={to} {...props}>
            {children}
        </Link>
    );
}

export default HeaderLink;
