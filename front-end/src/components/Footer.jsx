

import React from 'react';
import '../CSS/Footer.css'; // Separate CSS for footer

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} DecenTrust. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
