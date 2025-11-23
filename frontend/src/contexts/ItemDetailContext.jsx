import { createContext, useContext } from "react";
import { useState } from "react";

const ItemDetailContext = createContext();

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

// eslint-disable-next-line react-refresh/only-export-components
export const useItemDetail = () => useContext(ItemDetailContext);
