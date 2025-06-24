import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // The cookie is sent automatically by the browser
                const { data } = await api.get('/api/users/profile');
                setUserInfo(data);
            } catch (error) {
                setUserInfo(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;