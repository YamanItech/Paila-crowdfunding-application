import React from 'react'
import { Navigate } from 'react-router-dom';
function PrivateRoute({ children, userTypeRequired }) {
    const userType = localStorage.getItem('userRole');

    if (userType !== userTypeRequired) {
        return <Navigate to="/" />;
    }

    return children;

}

export default PrivateRoute
