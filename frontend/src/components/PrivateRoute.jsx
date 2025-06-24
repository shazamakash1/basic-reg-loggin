import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Loader from './Loader'; // Import the loader

const PrivateRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    // Show a full page loader while checking auth status
    return (
        <div className="flex justify-center items-center h-full">
            <Loader />
        </div>
    );
  }

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;