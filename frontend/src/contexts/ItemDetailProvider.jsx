import { useState } from "react";

import { ItemDetailContext } from "./ItemDetailContext";

export function ItemDetailProvider({ children }) {
    // const navigate = useNavigate();

    // const { external_id } = useParams();
    // const { access } = useAuth();
    // const { handleSave, handleShare, handleRating } = useItemActions();

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
