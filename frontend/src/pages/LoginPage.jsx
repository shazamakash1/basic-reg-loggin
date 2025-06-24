import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleIcon, GithubIcon } from '../components/Icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/auth/login', { email, password });
            const { data: profileData } = await api.get('/api/users/profile');
            setUserInfo(profileData);
            toast.success('Login successful!');
            navigate('/profile');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2">Log in with your email or a social account.</p>
                </div>

                {/* --- Social Login Buttons --- */}
                <div className="space-y-3 mb-6">
                    <a href="https://basic-reg-loggin.onrender.com/api/auth/google" className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-300">
                        <GoogleIcon className="h-5 w-5 mr-2" />
                        Continue with Google
                    </a>
                     <a href="https://basic-reg-loggin.onrender.com/api/auth/github" className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900 transition duration-300">
                        <GithubIcon className="h-5 w-5 mr-2" />
                        Continue with GitHub
                    </a>
                </div>

                {/* --- Divider --- */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                {/* --- Local Login Form --- */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out flex items-center justify-center disabled:opacity-75" type="submit" disabled={loading}>
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoginPage;