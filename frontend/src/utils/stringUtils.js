/**
 * Truncates a string to a specified maximum length
 * @param {string} string - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string with "..." if needed
 */
export const truncateString = (string, maxLength) => {
    if (string.length > maxLength) {
        return string.slice(0, maxLength) + "...";
    }
    return string;
};

/**
 * Generates a consistent color from a string using a simple hash algorithm
 * Useful for creating avatar background colors that are consistent for the same input
 * @param {string} string - The string to generate a color from
 * @returns {string} Hex color code (e.g., "#ff5733")
 */
export const stringToColor = (string) => {
    let hash = 0;
    let i;

    // Simple hash function - creates a numeric hash from the string
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    // Convert hash to RGB values
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

/**
 * Generates Material-UI Avatar props from a name string
 * Creates initials from first and last name, and a consistent background color
 * @param {string} name - Full name (e.g., "John Doe")
 * @returns {Object} Avatar props object with sx styling and children initials
 */
export const stringAvatar = (name) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1] ? name.split(" ")[1][0] : ""}`,
    };
};

export const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
export const toAbsoluteMediaUrl = (maybeRelativeUrl) => {
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
