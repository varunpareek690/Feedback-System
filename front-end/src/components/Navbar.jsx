import React from 'react';
import '../CSS/Navbar.css'; 

const Navbar = ({ showAuthButtons=false, onSignUpClick, onLoginClick }) => {
    return (
        <header className="navbar">
            <h1 className="logo">DecenTrust</h1>
            {showAuthButtons && (
                <nav>
                    <button className="auth-button" onClick={onSignUpClick}>Sign Up</button>
                    <button className="auth-button" onClick={onLoginClick}>Login</button>
                </nav>
            )}
        </header>
    );
};

export default Navbar;
