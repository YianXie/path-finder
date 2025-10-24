import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Loading backdrop component for showing loading states
 *
 * Displays a semi-transparent overlay with a loading spinner.
 * Commonly used during API calls or when waiting for data to load.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the backdrop is visible
 * @param {string} props.color - Color of the loading spinner (default: "inherit")
 */
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
