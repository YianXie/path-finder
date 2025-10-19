# PathFinder

PathFinder is a web application designed to provide personalized suggestions for SAS high school students on competitions, clubs, and tutoring based on their interests, skills, and academic goals.

[Demo link](https://sas-pathfinder.org)

## Purpose

High school students (including SAS students) often struggle to discover relevant extracurricular opportunities that align with their interests and career aspirations. PathFinder solves this problem by:

-   **Personalized Recommendations**: Get tailored suggestions for competitions, clubs, and internships based on your profile
-   **Comprehensive Database**: Access a curated collection of opportunities across various fields
-   **Smart Matching**: Our intelligent system matches your interests and goals with relevant opportunities
-   **User-Friendly Interface**: Easy-to-use platform designed specifically for high school students

## Tech Stack

### Backend

-   **Django 5.2.7**: Python web framework for building the REST API
-   **Django REST Framework 3.16.1**: Powerful toolkit for building Web APIs
-   **django-cors-headers**: Handles Cross-Origin Resource Sharing (CORS) for frontend-backend communication
-   **PostgreSQL/Sqlite**: Sqlite for production + PostgreSQL for production

### Frontend

-   **React 18**: Modern JavaScript library for building user interfaces
-   **Vite**: Next-generation frontend build tool for fast development
-   **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
-   **JavaScript/JSX**: Core frontend technologies

## Project Structure

```
path-finder/
├── backend/               # Django REST Framework backend
│   ├── pathfinder_api/     # Main Django project
│   ├── suggestions/        # Django app for handling suggestions
│   ├── manage.py           # Django management script
│   ├── render-build.py     # automatically runs when deploy to Render
│   └── requirements.txt    # Python dependencies
├── frontend/              # React frontend
│   ├── src/                # Source files
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   └── ...                 # other files
└── README.md              # This file
```

## Getting Started

### Prerequisites

-   Python 3.8 or higher
-   Node.js 18 or higher
-   npm or yarn

### Backend Setup

1. Navigate to the repo directory:

```bash
cd path-finder
```

2. Create and activate a virtual environment:

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Navigate to the backend directory:

```bash
cd backend
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Run migrations:

```bash
python manage.py migrate
```

6. Start the development server:

```bash
python manage.py runserver
```

The API should be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

-   `GET /api/health/` - Health check endpoint to verify the API is running
-   `POST /api/token/` - Obtain JWT access and refresh tokens
-   `POST /api/token/refresh/` - Refresh JWT access token using refresh token
-   `GET /api/suggestions/` - Get Google Spreadsheet data
-   `POST /accounts/google/` - Login with Google
-   `POST /accounts/parse-token/` - Parse a JWT token
-   `GET /accounts/profile/` - Get user info (e.g., email & name)
-   `POST /accounts/save-item/` - Save/unsave item

## Development

### Backend Development

-   The backend uses Django REST Framework to create RESTful APIs
-   API endpoints are defined in the `suggestions` app
-   CORS is configured to allow requests from the React frontend

#### Running Tests

To run the backend tests:

```bash
cd backend
python manage.py test
```

The test suite includes comprehensive tests for:

-   Health check endpoint
-   Token generation and refresh
-   Protected endpoint access control

### Frontend Development

-   The frontend is built with React and uses Vite for fast development
-   Tailwind CSS is used for styling instead of CSS modules
-   Components are located in the `src` directory

### Environment Variables

Refer to .env.example file located in the backend and frontend directory for more details

## Current Available Features

-   Login with Google
-   Email authentication to ensure only sas students or teachers have access to the website
-   Fetching Google Spreadsheet data
-   Create database rows with user data

## Future Features

-   Profile management
-   Advanced search and filtering
-   Personalized recommendation algorithm
-   User reviews and ratings

## License

This project is licensed under the MIT License - see the LICENSE file for details.
