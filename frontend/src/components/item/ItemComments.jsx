import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import api from "../../api";
import { useAsyncData } from "../../hooks";
import { stringAvatar } from "../../utils/stringUtils.js";

function ItemComments({ external_id, refreshKey }) {
    const [hasComments, setHasComments] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    const { data: reviews } = useAsyncData(async () => {
        const res = await api.get(
            `/api/social/reviews?external_id=${external_id}`
        );
        return res.data;
    }, [external_id, refreshKey]);

    useEffect(() => {
        if (reviews && reviews.length > 0) {
            for (const review of reviews) {
                if (
                    (review.comment && review.comment.trim() !== "") ||
                    review.image
                ) {
                    setHasComments(true);
                    return;
                }
            }
        }
    }, [reviews]);

    const toAbsoluteMediaUrl = (maybeRelativeUrl) => {
        if (!maybeRelativeUrl) return "";
        if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl;
        // Ensure leading slash on relative media path
        const path = maybeRelativeUrl.startsWith("/")
            ? maybeRelativeUrl
            : `/${maybeRelativeUrl}`;
        // Fallback to localhost:8000 if env is missing in dev
        const origin = apiBaseUrl || "http://localhost:8000";
        return `${origin}${path}`;
    };

    return (
        <>
            {hasComments ? (
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" fontWeight={500}>
                        User Review
                    </Typography>
                    <Stack spacing={2}>
                        {reviews.map((review) => {
                            return (
                                <>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        key={review.id}
                                        sx={{ p: 2 }}
                                    >
                                        <Avatar
                                            {...stringAvatar(review.user.name)}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                        <Stack
                                            direction="column"
                                            alignItems="flex-start"
                                            spacing={1}
                                            sx={{ ml: 2 }}
                                            width="100%"
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                justifyContent="space-between"
                                                width="100%"
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={500}
                                                    >
                                                        {review.user.name}
                                                    </Typography>
                                                    <Rating
                                                        value={review.rating}
                                                        size="small"
                                                        readOnly
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {new Date(
                                                        review.created_at
                                                    ).toLocaleDateString()}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                sx={
                                                    review.comment
                                                        ? {
                                                              fontStyle:
                                                                  "normal",
                                                          }
                                                        : {
                                                              fontStyle:
                                                                  "italic",
                                                          }
                                                }
                                            >
                                                {review.comment?.trim() ||
                                                    "No comment"}
                                            </Typography>
                                            {review.image && (
                                                <Link
                                                    href={toAbsoluteMediaUrl(
                                                        review.image
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View Image
                                                </Link>
                                            )}
                                        </Stack>
                                    </Stack>
                                    <Divider />
                                </>
                            );
                        })}
                    </Stack>
                </Box>
            ) : (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    sx={{ my: 4 }}
                >
                    No comments yet
                </Typography>
            )}
        </>
    );
}

export default ItemComments;
