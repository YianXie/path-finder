import { useLayoutEffect } from "react";

function usePageTitle(title) {
    useLayoutEffect(() => {
        document.title = title;
    }, [title]);
}

export default usePageTitle;
