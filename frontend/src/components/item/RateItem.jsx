import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackBar } from "../../contexts/SnackBarContext";

function RateItem({ open, onClose, external_id }) {
    const { access } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { setSnackBar } = useSnackBar();

    const handleSubmit = async () => {
        try {
            const res = await api.post("/api/social/rate/", {
                rating: rating,
                comment: comment,
                external_id: external_id,
            });
            if (res.status === 200) {
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
                message: error.response.data.detail,
            });
        } finally {
            onClose();
        }
    };

    return (
        <>
            {access && (
                <Container
                    maxWidth="md"
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        pointerEvents: open ? "auto" : "none",
                    }}
                >
                    <Backdrop
                        open={open}
                        onClick={onClose}
                        sx={(theme) => ({
                            color: theme.palette.primary.main,
                            backdropFilter: "brightness(0.5)",
                            zIndex: theme.zIndex.drawer + 1,
                        })}
                    ></Backdrop>
                    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                        <Box
                            sx={(theme) => ({
                                zIndex: 10000,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 2,
                                padding: 2,
                                boxShadow: 2,
                                width: "500px",
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
                                    my: 2,
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
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={!rating}
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Slide>
                </Container>
            )}
        </>
    );
}

export default RateItem;
