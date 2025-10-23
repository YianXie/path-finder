import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingBackdrop({ open, color = "inherit" }) {
    return (
        <Backdrop
            open={open}
            sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
            })}
        >
            <CircularProgress color={color} />
        </Backdrop>
    );
}

export default LoadingBackdrop;
