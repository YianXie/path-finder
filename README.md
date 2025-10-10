# PathFinder

PathFinder is a web application designed to provide personalized suggestions for high school students on competitions, clubs, and internships based on their interests, skills, and academic goals.

## Purpose

High school students often struggle to discover relevant extracurricular opportunities that align with their interests and career aspirations. PathFinder solves this problem by:

-   **Personalized Recommendations**: Get tailored suggestions for competitions, clubs, and internships based on your profile
-   **Comprehensive Database**: Access a curated collection of opportunities across various fields
-   **Smart Matching**: Our intelligent system matches your interests and goals with relevant opportunities
-   **User-Friendly Interface**: Easy-to-use platform designed specifically for high school students

## Tech Stack

### Backend

-   **Django 5.2.7**: Python web framework for building the REST API
-   **Django REST Framework 3.16.1**: Powerful toolkit for building Web APIs
-   **django-cors-headers**: Handles Cross-Origin Resource Sharing (CORS) for frontend-backend communication
-   **SQLite**: Default database for development (can be easily switched to PostgreSQL/MySQL for production)

### Frontend

-   **React 18**: Modern JavaScript library for building user interfaces
-   **Vite**: Next-generation frontend build tool for fast development
-   **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
-   **JavaScript/JSX**: Core frontend technologies

## Project Structure

```
path-finder/
├── backend/                 # Django REST Framework backend
│   ├── pathfinder_api/     # Main Django project
│   ├── suggestions/        # Django app for handling suggestions
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── frontend/               # React frontend
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

-   Python 3.8 or higher
-   Node.js 18 or higher
-   npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Start the development server:

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
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

## Development

### Backend Development

-   The backend uses Django REST Framework to create RESTful APIs
-   API endpoints are defined in the `suggestions` app
-   CORS is configured to allow requests from the React frontend

### Frontend Development

-   The frontend is built with React and uses Vite for fast development
-   Tailwind CSS is used for styling instead of CSS modules
-   Components are located in the `src` directory

## Future Features

-   User authentication and profile management
-   Advanced search and filtering
-   Personalized recommendation algorithm
-   Opportunity submissions from organizations
-   User reviews and ratings
-   Application tracking

## License

This project is licensed under the MIT License - see the LICENSE file for details.
