import React from 'react';
import '../CSS/Navbar.css'; 

const Navbar = ({ showAuthButtons=false, onSignUpClick, onClick , buttonName='Login'}) => {
    return (
        <header className="navbar">
            <h1 className="logo">DecenTrust</h1>
            {showAuthButtons && (
                <nav>
                    <button className="auth-button" onClick={onClick}>{buttonName}</button>
                </nav>
            )}
        </header>
    );
};

export default Navbar;
