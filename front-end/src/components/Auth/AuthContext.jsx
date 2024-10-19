import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState(null);

    return (
        <AuthContext.Provider value={{ connectedAccount, setConnectedAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
