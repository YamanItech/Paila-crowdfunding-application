import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, userTypeRequired }) {
    const userType = localStorage.getItem('userRole');

    // If user is not logged in at all
    if (!userType) {
        return <Navigate to="/login" />;
    }

    // If a specific role is required and user doesn't match it
    if (userTypeRequired && userType !== userTypeRequired) {
        return <Navigate to="/login" />; // Or show an error page
    }

    // User is allowed
    return children;
}

export default PrivateRoute;
