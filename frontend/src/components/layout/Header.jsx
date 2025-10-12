import HeaderLink from "./HeaderLink";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.addEventListener("scroll", (e) => {
            setIsScrolled(e.target.scrollTop > 0);
        });
    }, []);

    return (
        <header className={isScrolled ? "shadow-md" : ""}>
            <Box
                position={"sticky"}
                top={0}
                zIndex={1000}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={3}
                paddingBlock={2}
                paddingInline={4}
                borderBottom={1}
                borderColor="divider"
            >
                <Box
                    to="/"
                    display="flex"
                    alignItems="center"
                    className="cursor-pointer"
                    gap={1}
                    onClick={() => navigate("/")}
                >
                    <img
                        src="/logo.png"
                        alt="PathFinder"
                        width={32}
                        height={32}
                        draggable={false}
                        className="select-none"
                    />
                    <Typography variant="h6" className="select-none">
                        PathFinder
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <HeaderLink to="#">Clubs</HeaderLink>
                <HeaderLink to="#">Competitions</HeaderLink>
                <HeaderLink to="#">Tutoring</HeaderLink>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    ml="auto"
                >
                    <Divider orientation="vertical" flexItem />
                    <HeaderLink to="/profile">Profile</HeaderLink>
                </Box>
            </Box>
        </header>
    );
}

export default Header;
