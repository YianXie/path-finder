import { Container, Divider } from "@mui/material";
import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";

import api from "../api";
import { LoadingBackdrop, PageHeader } from "../components/common";
import ItemList from "../components/global/ItemList";
import { useAuth } from "../contexts/AuthContext";
import { useApiError } from "../hooks";

function HomeRedesign() {
    const { access } = useAuth();
    const { handleError } = useApiError();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);

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
                const endpoint = access
                    ? "/api/suggestions/personalized-suggestions/"
                    : "/api/suggestions/suggestions";

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
                console.log("access: ", access);
                if (access) {
                    setPersonalizedSuggestions(uniqueSuggestions.slice(0, 10));
                }
            } catch (error) {
                handleError(
                    error,
                    "Failed to load suggestions. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [handleError, access]
    );
    useEffect(() => {
        console.log("recommended for you: " + personalizedSuggestions);
        console.log("all suggestions: " + suggestions);
    }, [personalizedSuggestions, suggestions]);

    useEffect(() => {
        getSuggestions();
    }, [getSuggestions]);

    return (
        <Container maxWidth="xl">
            <LoadingBackdrop open={isLoading} />
            <PageHeader title="Welcome to PathFinder" className="mt-6 mb-4" />
            {personalizedSuggestions.length > 0 && (
                <Fragment key="recommended-for-you">
                    <ItemList
                        name={"Recommended For You"}
                        suggestions={personalizedSuggestions}
                    />
                    <Divider sx={{ marginY: 2 }} />
                </Fragment>
            )}
            {tagsList.map((tag, index) => (
                <Fragment key={tag + index}>
                    <ItemList
                        name={tag}
                        suggestions={suggestions.filter((suggestion) =>
                            suggestion.tags.includes(tag)
                        )}
                    />
                    <Divider sx={{ marginY: 2 }} />
                </Fragment>
            ))}
        </Container>
    );
}

export default HomeRedesign;
