import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    // Check if user is already logged in on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // The cookie is sent automatically by the browser
                const { data } = await api.get('/api/users/profile');
                setUserInfo(data.user);
            } catch (error) {
                setUserInfo(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
