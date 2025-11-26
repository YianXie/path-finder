import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

import Item from "./Item";

/**
 * ItemList component for displaying a horizontal scrollable list of items
 *
 * Displays a collection of Item components in a horizontally scrollable container.
 * Includes scroll state management with visual indicators (fade gradients) showing
 * when more content is available to scroll. Automatically detects scroll position
 * and content size changes using ResizeObserver.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.suggestions - Array of item objects to display
 * @param {string} props.name - Title/heading for the item list
 * @param {Function} props.handleSaveStatusUpdate - Callback called after save/unsave operations
 * @param {Array<string>} props.selectedItems - Array of selected item external IDs for comparison
 * @param {Function} props.setSelectedItems - Function to update selected items array
 */
function ItemList({
    suggestions,
    name,
    handleSaveStatusUpdate,
    selectedItems,
    setSelectedItems,
}) {
    const itemListRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        canScrollLeft: false,
        canScrollRight: false,
        atLeft: true,
        atRight: false,
    });

    /**
     * Checks the current scroll state of the container
     * Updates state to reflect whether scrolling is possible and current position
     * @param {HTMLElement} el - The scrollable container element
     */
    const checkScrollState = (el) => {
        if (!el) return;

        const scrollLeft = el.scrollLeft;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const atLeft = scrollLeft <= 0;
        const atRight = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding
        const canScroll = scrollWidth > clientWidth;

        setScrollState({
            canScrollLeft: canScroll && !atLeft,
            canScrollRight: canScroll && !atRight,
            atLeft,
            atRight,
        });
    };

    useEffect(() => {
        const el = itemListRef.current;
        if (!el || suggestions.length === 0) return;

        // Initial check
        checkScrollState(el);

        // Check on scroll
        const handleScroll = () => {
            checkScrollState(el);
        };

        // Check on resize (content might change)
        const handleResize = () => {
            checkScrollState(el);
        };

        el.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        // Use ResizeObserver to detect content size changes
        const resizeObserver = new ResizeObserver(() => {
            checkScrollState(el);
        });
        resizeObserver.observe(el);

        return () => {
            el.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            resizeObserver.disconnect();
        };
    }, [suggestions]);

    return (
        <Box display="flex" flexDirection="column" gap={2} padding={2}>
            <Typography variant="h4" fontWeight={400} margin={1}>
                {name}
            </Typography>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                }}
            >
                {/* Left fade gradient indicator */}
                {scrollState.canScrollLeft && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 40,
                            background: (theme) =>
                                `linear-gradient(to right, ${theme.palette.background.paper}, transparent)`,
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                )}

                {/* Right fade gradient indicator */}
                {scrollState.canScrollRight && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 40,
                            background: (theme) =>
                                `linear-gradient(to left, ${theme.palette.background.paper}, transparent)`,
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                )}

                {/* Scrollable container */}
                <Box
                    ref={itemListRef}
                    sx={{
                        position: "relative",
                        display: "flex",
                        overflowX: "auto",
                        gap: 2,
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        width: "100%",
                        scrollBehavior: "smooth",
                    }}
                >
                    {[...suggestions].map(
                        (suggestion, index) =>
                            suggestion && (
                                <Box
                                    sx={{ flex: "0 0 auto", padding: 1 }}
                                    key={`${suggestion.external_id}-${index}`}
                                >
                                    <Item
                                        {...suggestion}
                                        handleSaveStatusUpdate={
                                            handleSaveStatusUpdate
                                        }
                                        selectedItems={selectedItems}
                                        setSelectedItems={setSelectedItems}
                                    />
                                </Box>
                            )
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default ItemList;
