import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="mx-auto max-w-4xl p-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-5xl font-bold text-indigo-900">
                        PathFinder
                    </h1>
                    <p className="mb-6 text-xl text-gray-700">
                        Personalized suggestions for high school students
                    </p>
                    <p className="text-gray-600">
                        Get recommendations for competitions, clubs, and
                        internships tailored to your interests and goals.
                    </p>
                </div>

                <div className="mb-6 rounded-lg bg-white p-8 shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                        Coming Soon
                    </h2>
                    <p className="text-gray-600">
                        We're building an intelligent platform to help you
                        discover opportunities that align with your academic
                        interests and career goals.
                    </p>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setCount((count) => count + 1)}
                        className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-indigo-700 hover:shadow-lg"
                    >
                        Click count: {count}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
