import { Outlet } from "react-router-dom";

import Header from "./Header";

/**
 * Layout component that provides consistent page structure
 *
 * Wraps all page content with a header and main content area.
 * Uses React Router's Outlet to render child route components.
 * Provides consistent layout across all pages in the application.
 */
function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
