import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';

const Header = () => {
    const { userInfo, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // ** THE FIX IS HERE **
            // The logout route was moved to /api/auth on the backend
            await api.post('/api/auth/logout');
            setUserInfo(null);
            toast.success('Logged out successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed.');
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            AuthFlow
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {userInfo ? (
                            <>
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium">
                                    <img src={userInfo.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                    <span>{userInfo.name || userInfo.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
