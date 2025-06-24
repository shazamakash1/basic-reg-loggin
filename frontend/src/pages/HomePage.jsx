import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                    Secure <span className="text-indigo-600">Authentication</span> Made Simple
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-gray-500">
                    A robust, ready-to-use authentication template using the MERN stack.
                    Jumpstart your next project with a secure foundation.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/register" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transform transition hover:scale-105 duration-300 ease-in-out">
                        Get Started
                    </Link>
                    <Link to="/login" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transform transition hover:scale-105 duration-300 ease-in-out">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;