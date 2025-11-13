import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import api from "../../api";
import { useAsyncData } from "../../hooks";
import { stringAvatar } from "../../utils/stringUtils.js";

function ItemComments({ external_id }) {
    const { data: reviews } = useAsyncData(async () => {
        const res = await api.get(
            `/api/social/reviews?external_id=${external_id}`
        );
        return res.data;
    }, []);

    return (
        <>
            {reviews && reviews.length > 0 ? (
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" fontWeight={500}>
                        User Review
                    </Typography>
                    <Stack spacing={2}>
                        {reviews &&
                            reviews.map((review) => {
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
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Stack
                                                direction="column"
                                                alignItems="flex-start"
                                                spacing={1}
                                                sx={{ ml: 2 }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
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
                                                </Stack>
                                                <Typography>
                                                    {review.comment}
                                                </Typography>
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
                    No reviews yet
                </Typography>
            )}
        </>
    );
}

export default ItemComments;
