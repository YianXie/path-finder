import { createContext, useContext } from "react";
import { useState } from "react";

const ItemDetailContext = createContext();

/**
 * ItemDetailContext provider - Manages state for item detail page
 *
 * Provides centralized state management for item detail information including:
 * - Item data (name, description, image, etc.)
 * - Loading and error states
 * - Saved status
 * - Rating information (user rating, average rating, number of ratings)
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export function ItemDetailProvider({ children }) {
    const [itemInfo, setItemInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [numRatings, setNumRatings] = useState(0);
    const [error, setError] = useState(null);

    const contextValue = {
        state: {
            itemInfo,
            isSaved,
            rating,
            isLoading,
            error,
            averageRating,
            numRatings,
        },
        setters: {
            setItemInfo,
            setIsSaved,
            setRating,
            setIsLoading,
            setError,
            setAverageRating,
            setNumRatings,
        },
    };

    return (
        <ItemDetailContext.Provider value={contextValue}>
            {children}
        </ItemDetailContext.Provider>
    );
}

/**
 * Hook to access item detail context
 * @returns {Object} Item detail context value
 * @returns {Object} returns.state - Current item detail state
 * @returns {Object} returns.state.itemInfo - Item information object
 * @returns {boolean} returns.state.isSaved - Whether the item is saved
 * @returns {number} returns.state.rating - User's rating for the item
 * @returns {boolean} returns.state.isLoading - Loading state
 * @returns {string|null} returns.state.error - Error message if any
 * @returns {number} returns.state.averageRating - Average rating from all users
 * @returns {number} returns.state.numRatings - Total number of ratings
 * @returns {Object} returns.setters - State setter functions
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useItemDetail = () => useContext(ItemDetailContext);
