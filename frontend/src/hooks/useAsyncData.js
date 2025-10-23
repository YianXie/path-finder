import { useCallback, useEffect, useState } from "react";

import useApiError from "./useApiError";

/**
 * Custom hook to fetch data asynchronously
 * @param {Function} apiCall - The API call function
 * @param {Array} dependencies - The dependencies to watch for changes
 * @returns {Object} - The data, loading state, error, and refetch function
 */
function useAsyncData(apiCall, dependencies = []) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { handleError } = useApiError();

    const fetchData = useCallback(
        async (...args) => {
            try {
                setError(null);
                const result = await apiCall(...args);
                setData(result);
                return result;
            } catch (err) {
                setError(err);
                handleError(err, "Failed to fetch data");
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [apiCall, handleError]
    );

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, ...dependencies]);

    return { data, isLoading, error, refetch: fetchData };
}

export default useAsyncData;
