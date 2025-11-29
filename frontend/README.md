# Frontend

The frontend is a React-based single-page application (SPA) built with Vite, providing an interactive user interface for PathFinder—a platform that helps SAS high school students discover extracurricular opportunities.

## Overview

The frontend application provides:

- **User Authentication**: Google OAuth integration for SAS students and staff
- **Personalized Discovery**: Browse and search extracurricular opportunities
- **User Profiles**: Save items, complete onboarding, and manage preferences
- **Social Features**: Rate and review opportunities, view community feedback
- **Responsive Design**: Modern UI with Material-UI components and Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Material-UI 7** - Component library with dark mode support
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client with automatic token refresh
- **Fuse.js** - Fuzzy search library
- **React Window** - Virtualized lists for performance

## File Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (LoadingBackdrop, PageHeader)
│   │   ├── global/          # Global components (Item, ItemList, ProtectedRoute, GoogleButton, CompareSlider)
│   │   ├── item/            # Item-specific components (ItemDetailCard, ItemActions, ItemComments, etc.)
│   │   ├── layout/          # Layout components (Header, HeaderLink, Layout)
│   │   └── LazyWrapper.jsx  # Code-splitting wrapper for lazy-loaded pages
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state management
│   │   ├── ItemDetailContext.jsx  # Item detail page state
│   │   └── SnackBarContext.jsx    # Global notification system
│   ├── hooks/               # Custom React hooks
│   │   ├── useApiError.js   # API error handling
│   │   ├── useAsyncData.js  # Data fetching with loading/error states
│   │   ├── useItemActions.js  # Item interaction logic (save, rate, etc.)
│   │   ├── useMenu.js       # Menu state management
│   │   └── usePageTitle.js  # Dynamic page title updates
│   ├── pages/               # Route-level page components
│   │   ├── auth/            # Authentication pages (Login, Logout, Saved)
│   │   ├── onBoarding/      # User onboarding flow (Step1, Step2, Step3, OnBoardingFinished)
│   │   ├── About.jsx        # About page
│   │   ├── Compare.jsx      # Item comparison page
│   │   ├── Home.jsx         # Homepage with personalized suggestions
│   │   ├── ItemDetail.jsx   # Individual opportunity detail page
│   │   ├── NotFoundPage.jsx # 404 error page
│   │   └── Search.jsx       # Search page with filters
│   ├── utils/               # Utility functions
│   │   ├── index.js         # General utilities
│   │   └── stringUtils.js   # String manipulation helpers
│   ├── api.js               # Axios instance with interceptors for auth
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets (favicon, logo)
├── dist/                    # Production build output
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration (code splitting, optimizations)
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
└── .prettierrc             # Prettier formatting rules
```

## Key Components

### Authentication (`contexts/AuthContext.jsx`)

- Manages user authentication state
- Handles Google OAuth login flow
- Stores JWT tokens (access and refresh) in localStorage
- Provides authentication status to all components

### API Client (`api.js`)

- Configured Axios instance with base URL from environment variables
- **Request Interceptor**: Automatically adds JWT access token to all requests
- **Response Interceptor**: Handles 401 errors by automatically refreshing tokens
- Retries failed requests after token refresh

### Routing (`App.jsx`)

- Public routes: `/`, `/about`, `/search`, `/login`, `/item/:external_id`, `/compare`
- Protected routes (require authentication): `/saved`, `/onboarding`, `/logout`
- Lazy loading for performance optimization
- Layout wrapper for consistent page structure

### Pages

#### Home (`pages/Home.jsx`)

- Displays personalized suggestions for authenticated users
- Shows all suggestions for unauthenticated users
- Infinite scroll pagination
- Item cards with save functionality

#### Search (`pages/Search.jsx`)

- Full-text search with fuzzy matching
- Filter by categories and tags
- Real-time search results

#### Item Detail (`pages/ItemDetail.jsx`)

- Comprehensive view of an opportunity
- Rating and review system
- Save/unsave functionality
- Related items suggestions

#### Onboarding (`pages/onBoarding/`)

- Multi-step form to collect user preferences
- Captures: basic information, interests, goals
- Required for new users to access personalized features

#### Saved (`pages/auth/Saved.jsx`)

- User's saved opportunities dashboard
- Quick access to bookmarked items

### Protected Routes (`components/global/ProtectedRoute.jsx`)

- Higher-order component that checks authentication
- Redirects to login if user is not authenticated
- Wraps routes that require authentication

## Development

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file (`.env.local` or `.env`):

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_ENVIRONMENT=development
```

3. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start Vite development server with hot module replacement
- `npm run build` - Build production bundle with code splitting
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Build Configuration

The `vite.config.js` includes:

- **Code Splitting**: Vendor chunks for React, MUI, router, and utilities
- **Optimization**: ESBuild minification, ESNext target
- **Performance**: Chunk size warnings, optimized dependencies

## State Management

The application uses React Context API for global state:

1. **AuthContext**: User authentication, tokens, profile data
2. **SnackBarContext**: Global notification system for success/error messages
3. **ItemDetailContext**: Item detail page state (ratings, comments, etc.)

Local component state is managed with React hooks (`useState`, `useEffect`, etc.).

## Styling

- **Material-UI**: Primary component library with dark mode theme
- **Tailwind CSS**: Utility classes for custom styling
- **Emotion**: CSS-in-JS styling engine (used by Material-UI)

The app defaults to dark mode, with theme configuration in `main.jsx`.

## API Integration

All API calls go through the configured Axios instance in `api.js`:

- Base URL from `VITE_API_URL` environment variable
- Automatic JWT token injection
- Automatic token refresh on 401 errors
- Error handling and retry logic

## Performance Optimizations

- **Lazy Loading**: Route-level code splitting via `LazyWrapper.jsx`
- **Virtual Scrolling**: React Window for large lists
- **Code Splitting**: Vendor chunks separated in build
- **Optimized Dependencies**: Pre-bundled common libraries

## Browser Support

Modern browsers with ES2020+ support (Chrome, Firefox, Safari, Edge).
