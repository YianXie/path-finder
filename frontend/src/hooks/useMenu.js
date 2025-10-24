import { useState } from "react";

/**
 * Custom hook for managing Material-UI menu state
 *
 * Provides state management for menu components including anchor element,
 * open state, and handlers for opening/closing menus.
 *
 * @returns {Object} Object containing menu state and handlers
 * @returns {Element|null} returns.anchorEl - The anchor element for the menu
 * @returns {boolean} returns.open - Whether the menu is currently open
 * @returns {Function} returns.handleClick - Function to open the menu
 * @returns {Function} returns.handleClose - Function to close the menu
 */
function useMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    /**
     * Opens the menu by setting the anchor element
     * @param {Event} event - The click event that triggered the menu
     */
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the menu by clearing the anchor element
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    return {
        anchorEl,
        open,
        handleClick,
        handleClose,
    };
}

export default useMenu;
