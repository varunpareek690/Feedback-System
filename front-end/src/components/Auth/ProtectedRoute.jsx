import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import your AuthContext

const ProtectedRoute = ({ element, ...rest }) => {
    const { connectedAccount } = useAuth();

    return (
        <Route
            {...rest}
            element={connectedAccount ? element : <Navigate to="/" />} // Redirect to the home page if not authenticated
        />
    );
};

export default ProtectedRoute;
