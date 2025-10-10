import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            PathFinder
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Personalized suggestions for high school students
          </p>
          <p className="text-gray-600">
            Get recommendations for competitions, clubs, and internships tailored to your interests and goals.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            We're building an intelligent platform to help you discover opportunities that align with your academic interests and career goals.
          </p>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Click count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

