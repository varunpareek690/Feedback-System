import React from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/Navbar.css';

const Navbar = ({ showAuthButtons = false, onClick, onSignUpClick, buttonName = 'Login' }) => {
    const location = useLocation();

    return (
        <header className="navbar">
            <h1 className="logo">DecenTrust</h1>
            {showAuthButtons && (
                <nav>
                    {location.pathname === '/' && (
                        <button className="auth-button" onClick={onSignUpClick}>Signup as Org</button>
                    )}
                    <button className="auth-button" onClick={onClick}>{buttonName}</button>
                </nav>
            )}
        </header>
    );
};

export default Navbar;
