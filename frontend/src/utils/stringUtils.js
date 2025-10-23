// Utility function to truncate strings
export const truncateString = (string, maxLength) => {
    if (string.length > maxLength) {
        return string.slice(0, maxLength) + "...";
    }
    return string;
};

// Utility function to generate avatar colors
export const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

// Utility function to generate avatar props
export const stringAvatar = (name) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
};
