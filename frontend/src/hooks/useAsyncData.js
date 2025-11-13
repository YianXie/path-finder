import { useCallback, useEffect, useState } from "react";

import useApiError from "./useApiError";

/**
 * Custom hook for managing asynchronous data fetching
 *
 * Provides a standardized way to handle API calls with loading states,
 * error handling, and automatic refetching when dependencies change.
 * Integrates with the global error handling system for consistent UX.
 *
 * @param {Function} apiCall - The API call function to execute
 * @param {Array} dependencies - Array of dependencies to watch for changes (triggers refetch)
 * @returns {Object} Object containing data state and controls
 * @returns {any|null} returns.data - The fetched data (null while loading or on error)
 * @returns {boolean} returns.isLoading - Whether a request is currently in progress
 * @returns {Error|null} returns.error - Any error that occurred during the last request
 * @returns {Function} returns.refetch - Function to manually trigger a refetch
 */
function useAsyncData(apiCall, dependencies = []) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { handleError } = useApiError();

    /**
     * Internal function to execute the API call and manage state
     * @param {...any} args - Arguments to pass to the API call function
     * @returns {Promise<any>} The result of the API call
     */
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
    }, [...dependencies]);

    return { data, isLoading, error, refetch: fetchData };
}

export default useAsyncData;
