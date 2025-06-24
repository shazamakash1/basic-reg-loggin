import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { userInfo } = useContext(AuthContext);

  // If userInfo is available, render the child routes (e.g., ProfilePage).
  // Otherwise, redirect the user to the /login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;