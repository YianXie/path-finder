import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function HeaderLink({ children, to, ...props }) {
    return (
        <Link component={RouterLink} underline="hover" to={to} {...props}>
            {children}
        </Link>
    );
}

export default HeaderLink;
