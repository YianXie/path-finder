import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { forwardRef, useEffect, useState } from "react";

import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

/**
 * RateItem component - Dialog for submitting item reviews
 *
 * Provides a modal dialog for authenticated users to rate and review items.
 * Includes rating selection, comment text field, and optional image upload.
 * Submits review data to the backend and triggers refresh callback on success.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback function to close the dialog
 * @param {string} props.external_id - Unique identifier for the item being rated
 * @param {Function} props.onSubmitted - Callback function called after successful submission
 */
function RateItem({ open, onClose, external_id, onSubmitted }) {
    const { isAuthenticated } = useAuth();
    const { setSnackBar } = useSnackBar();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("rating", String(rating));
            formData.append("comment", comment);
            formData.append("external_id", external_id);
            if (image) {
                formData.append("image", image);
            }

            const res = await api.post("/api/social/rate/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status === 200) {
                if (typeof onSubmitted === "function") {
                    onSubmitted();
                }
                setSnackBar({
                    open: true,
                    severity: "success",
                    message: "Item rated successfully",
                });
            }
        } catch (error) {
            setSnackBar({
                open: true,
                severity: "error",
                message:
                    error?.response?.data?.detail ||
                    "Failed to submit review. Please try again.",
            });
        } finally {
            onClose();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        async function fetchUserReview() {
            try {
                const res = await api.get("/api/social/user-review/", {
                    params: { external_id: external_id },
                });
                setUserReview(res.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserReview();
    }, [isAuthenticated, external_id]);

    useEffect(() => {
        if (userReview) {
            setRating(userReview.rating);
            setComment(userReview.comment);

            if (userReview.image) {
                const file = new File(
                    [userReview.image],
                    userReview.image.name,
                    {
                        type: userReview.image.content_type,
                    }
                );
                setImage(file);
            }
        }
    }, [userReview]);

    return (
        <>
            {isAuthenticated && (
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    slots={{
                        transition: Transition,
                    }}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: open ? "auto" : "none",
                    }}
                >
                    <Box
                        sx={(theme) => ({
                            zIndex: 10000,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 2,
                            padding: 2,
                            boxShadow: 2,
                            width: { xs: "350px", md: "500px" },
                            maxWidth: "100%",
                        })}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h6" color="primary">
                                Write a review
                            </Typography>
                            <Tooltip title="Close" arrow>
                                <IconButton onClick={onClose}>
                                    <CloseIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Divider sx={{ my: 2 }} />

                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <Typography variant="body1" color="primary">
                                Rating
                            </Typography>
                            <Rating
                                value={rating}
                                precision={1}
                                size="large"
                                onChange={(event, newValue) =>
                                    setRating(newValue)
                                }
                            />
                        </Box>
                        <Box
                            sx={{
                                mt: 2,
                                mb: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <Typography variant="body1" color="primary">
                                Review
                            </Typography>
                            <TextField
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Write your review here"
                                value={comment}
                                onChange={(event) =>
                                    setComment(event.target.value)
                                }
                            />
                        </Box>
                        <Button
                            sx={{ fontWeight: 500, mb: 1 }}
                            role={undefined}
                            tabIndex={-1}
                            startIcon={<UploadIcon />}
                            component="label"
                        >
                            {image ? image.name : "Upload Image"}
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    setImage(event.target.files[0])
                                }
                            />
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={!rating || isLoading}
                            sx={{ mt: 2 }}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography
                                        variant="body1"
                                        fontWeight={500}
                                        color="inherit"
                                    >
                                        Loading...
                                    </Typography>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </Dialog>
            )}
        </>
    );
}

export default RateItem;
