import { createContext, useContext, useEffect, useState } from "react";

const SearchActiveContext = createContext();

/**
 * Search active context provider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactNode} Search active context provider
 */
export const SearchActiveProvider = ({ children }) => {
    const [searchActive, setSearchActive] = useState(false);

    useEffect(() => {
        if (searchActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [searchActive]);

    return (
        <SearchActiveContext.Provider value={{ searchActive, setSearchActive }}>
            {children}
        </SearchActiveContext.Provider>
    );
};

/**
 * Hook to access search active context
 * @returns {Object} Search active context value
 * @returns {boolean} returns.searchActive - Whether the search is active
 * @returns {Function} returns.setSearchActive - Function to set the search active state
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSearchActive = () => useContext(SearchActiveContext);
