import Link from "@mui/material/Link";

function HeaderLink({ children, to, ...props }) {
    return (
        <Link href={to} underline="hover" {...props}>
            {children}
        </Link>
    );
}

export default HeaderLink;
