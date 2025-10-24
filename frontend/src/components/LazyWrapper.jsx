import { Box, CircularProgress } from "@mui/material";
import { Suspense, lazy } from "react";

// Lazy load components for better code splitting
// These components are only loaded when needed, reducing initial bundle size
const ItemDetail = lazy(() => import("../pages/ItemDetail"));
const OnBoarding = lazy(() => import("../pages/onBoarding/OnBoarding"));
const Saved = lazy(() => import("../pages/auth/Saved"));
const Competitions = lazy(() => import("../pages/Competitions"));
const Clubs = lazy(() => import("../pages/Clubs"));
const Tutoring = lazy(() => import("../pages/Tutoring"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/**
 * Loading spinner component shown while lazy components are loading
 * Provides a centered circular progress indicator
 */
const LoadingSpinner = () => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
    >
        <CircularProgress />
    </Box>
);

/**
 * Lazy-loaded ItemDetail component with loading fallback
 * @param {Object} props - Props to pass to ItemDetail component
 */
export const LazyItemDetail = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <ItemDetail {...props} />
    </Suspense>
);

/**
 * Lazy-loaded OnBoarding component with loading fallback
 * @param {Object} props - Props to pass to OnBoarding component
 */
export const LazyOnBoarding = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <OnBoarding {...props} />
    </Suspense>
);

/**
 * Lazy-loaded Saved component with loading fallback
 * @param {Object} props - Props to pass to Saved component
 */
export const LazySaved = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Saved {...props} />
    </Suspense>
);

/**
 * Lazy-loaded Competitions component with loading fallback
 * @param {Object} props - Props to pass to Competitions component
 */
export const LazyCompetitions = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Competitions {...props} />
    </Suspense>
);

/**
 * Lazy-loaded Clubs component with loading fallback
 * @param {Object} props - Props to pass to Clubs component
 */
export const LazyClubs = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Clubs {...props} />
    </Suspense>
);

/**
 * Lazy-loaded Tutoring component with loading fallback
 * @param {Object} props - Props to pass to Tutoring component
 */
export const LazyTutoring = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Tutoring {...props} />
    </Suspense>
);

/**
 * Lazy-loaded NotFoundPage component with loading fallback
 * @param {Object} props - Props to pass to NotFoundPage component
 */
export const LazyNotFoundPage = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage {...props} />
    </Suspense>
);
