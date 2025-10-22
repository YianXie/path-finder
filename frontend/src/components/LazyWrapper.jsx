import { Box, CircularProgress } from "@mui/material";
import { Suspense, lazy } from "react";

// Lazy load components for better code splitting
const ItemDetail = lazy(() => import("../pages/ItemDetail"));
const OnBoarding = lazy(() => import("../pages/OnBoarding"));
const Saved = lazy(() => import("../pages/auth/Saved"));
const Competitions = lazy(() => import("../pages/Competitions"));
const Clubs = lazy(() => import("../pages/Clubs"));
const Tutoring = lazy(() => import("../pages/Tutoring"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

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

export const LazyItemDetail = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <ItemDetail {...props} />
    </Suspense>
);

export const LazyOnBoarding = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <OnBoarding {...props} />
    </Suspense>
);

export const LazySaved = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Saved {...props} />
    </Suspense>
);

export const LazyCompetitions = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Competitions {...props} />
    </Suspense>
);

export const LazyClubs = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Clubs {...props} />
    </Suspense>
);

export const LazyTutoring = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <Tutoring {...props} />
    </Suspense>
);

export const LazyNotFoundPage = (props) => (
    <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage {...props} />
    </Suspense>
);
