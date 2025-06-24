import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader'; // Import the loader

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            await api.post('/api/users/login', { username, password });
            const { data: profileData } = await api.get('/api/users/profile');
            setUserInfo(profileData);
            toast.success('Login successful!');
            navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2">Please enter your details to log in.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* ... form inputs ... */}
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                           className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out flex items-center justify-center disabled:opacity-75" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <div className="loader-button"></div> : 'Sign In'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    New Customer?{' '}
                    <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

// Add loader style for buttons
const styles = `
.loader-button {
  width: 24px;
  height: 24px;
  border: 3px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default LoginPage;
