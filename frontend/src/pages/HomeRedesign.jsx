import { Container, Divider } from "@mui/material";
import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import api from "../api";
import { LoadingBackdrop, PageHeader } from "../components/common";
import ItemList from "../components/global/ItemList";
import { useApiError } from "../hooks";
import { Fragment } from "react";

function HomeRedesign() {
    const { handleError } = useApiError();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const tagsList = [
        "STEM & Innovation",
        "Community & Service",
        "Sports & Fitness",
        "Gaming & Technology",
        "Arts & Design",
    ];

    const getSuggestions = useCallback(
        async (page = 1) => {
            try {
                setIsLoading(true);
                const endpoint = "/api/suggestions/suggestions";

                const params = { page, page_size: 50 };
                const res = await api.get(endpoint, { params });

                const uniqueSuggestions = res.data.results.filter(
                    (suggestion, index, self) =>
                        index ===
                        self.findIndex(
                            (s) => s.external_id === suggestion.external_id
                        )
                );

                setSuggestions(uniqueSuggestions);
            } catch (error) {
                handleError(
                    error,
                    "Failed to load suggestions. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [handleError]
    );

    useEffect(() => {
        getSuggestions();
    }, [getSuggestions]);

    return (
        <Container maxWidth="xl">
            <LoadingBackdrop open={isLoading} />
            <PageHeader title="Welcome to PathFinder" className="mt-6 mb-4" />
            {tagsList.map((tag, index) => (
                <Fragment key={tag+index}>
                    <ItemList
                        name={tag}
                        tag={tag}
                        suggestions={suggestions}
                    />
                    <Divider
                        sx={{ marginY: 2 }}
                    />
                </Fragment>
            ))}
        </Container>
    );
}

export default HomeRedesign;
