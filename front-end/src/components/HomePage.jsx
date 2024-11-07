import React from 'react';
import '../CSS/HomePage.css'; 
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
const HomePage = () => {
    const navigate = useNavigate();
    const handleSignUpClick = () => {
        navigate('/signuporg');
      };
    const handleLoginClick = () => {
        navigate('/login');
      };

    return (
        <div className="home-container">
            <Navbar 
                showSignupButton={true}
                showAuthButtons={true}
                onSignUpClick={handleSignUpClick}
                onClick={handleLoginClick}
            />
            <div className="content_homepage">
                <div className='graphic'>
                <img src="/Home-logo.png" alt="Blockchain Feedback"/>
                </div>
                <h2 className="tagline">Revolutionizing Feedback with Blockchain Technology</h2>
                <h3 className="tagline">Secure, Transparent, and Decentralized</h3>
            </div>
            <Footer/>
        </div>
    );
};

export default HomePage;