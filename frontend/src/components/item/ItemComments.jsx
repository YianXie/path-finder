import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import api from "../../api";
import { useAsyncData } from "../../hooks";
import { stringAvatar, toAbsoluteMediaUrl } from "../../utils/stringUtils.js";

/**
 * ItemComments component - User reviews and comments display
 *
 * Fetches and displays user reviews/ratings for a specific item.
 * Shows user avatars, names, ratings, comments, and uploaded images.
 * Only displays the section if there are reviews with comments or images.
 * Automatically refreshes when refreshKey changes.
 *
 * @param {Object} props - Component props
 * @param {string} props.external_id - Unique identifier for the item
 * @param {number} props.refreshKey - Key used to trigger data refresh
 */
function ItemComments({ external_id, refreshKey }) {
    const [hasComments, setHasComments] = useState(false);

    const { data: reviews, isLoading } = useAsyncData(async () => {
        const res = await api.get(`/api/social/reviews`, {
            params: {
                external_id: external_id,
            },
        });
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

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading]);

    return (
        <>
            {isLoading ? (
                <Stack spacing={2} direction="row" alignItems="center" my={2}>
                    <Skeleton
                        variant="circular"
                        animation="wave"
                        height={40}
                        width={40}
                    />
                    <Stack direction="column" width="100%">
                        <Skeleton
                            variant="text"
                            animation="wave"
                            height={40}
                            width="100%"
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            height={100}
                            width="100%"
                        />
                    </Stack>
                </Stack>
            ) : (
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
                                                    {...stringAvatar(
                                                        review.user.name
                                                    )}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                    }}
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
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Typography
                                                                fontWeight={500}
                                                            >
                                                                {
                                                                    review.user
                                                                        .name
                                                                }
                                                            </Typography>
                                                            <Rating
                                                                value={
                                                                    review.rating
                                                                }
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
                                                    {review.image?.url && (
                                                        <Link
                                                            href={toAbsoluteMediaUrl(
                                                                review.image.url
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
            )}
        </>
    );
}

export default ItemComments;
