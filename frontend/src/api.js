import axios from "axios";

// Create axios instance with base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue = [];
let refreshPromise = null;

/**
 * Process queued requests after token refresh completes
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Request interceptor to automatically add authentication token
 * Adds the access token from localStorage to all outgoing requests
 */
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle automatic token refresh
 *
 * Intercepts 401 responses and attempts to refresh the access token.
 * If refresh succeeds, retries the original request with the new token.
 * If refresh fails, clears tokens and redirects to login page.
 * Queues concurrent requests during token refresh to prevent multiple refresh attempts.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 errors and if not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If we're already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;

            const refreshTokenValue = localStorage.getItem("refresh");
            if (!refreshTokenValue) {
                // No refresh token available, clear and redirect
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }

            // If we're already refreshing, wait for the existing refresh to complete
            if (isRefreshing && refreshPromise) {
                try {
                    const newAccessToken = await refreshPromise;
                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            // Start a new refresh attempt
            isRefreshing = true;
            refreshPromise = axios
                .post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                    refresh: refreshTokenValue,
                })
                .then((response) => {
                    const { access } = response.data;
                    localStorage.setItem("access", access);
                    processQueue(null, access);
                    return access;
                })
                .catch((refreshError) => {
                    // Refresh failed, clear tokens and redirect to login
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    processQueue(refreshError, null);

                    // Only redirect if we're not already on the login page
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                    throw refreshError;
                })
                .finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });

            try {
                const newAccessToken = await refreshPromise;
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
