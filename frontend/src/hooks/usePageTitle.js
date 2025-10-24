import { useLayoutEffect } from "react";

/**
 * Custom hook to set the page title
 *
 * Updates the browser tab title when the component mounts or when the title changes.
 * Uses useLayoutEffect to ensure the title is set synchronously before the browser paints.
 *
 * @param {string} title - The title to set for the page
 */
function usePageTitle(title) {
    useLayoutEffect(() => {
        document.title = title;
    }, [title]);
}

export default usePageTitle;
