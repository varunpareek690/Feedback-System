import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginOrg.css';
import Navbar from './Navbar';
import Footer from './Footer';

const LoginOrg = () => {
    require('dotenv').config();
    const [orgEmail, setOrgEmail] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!orgEmail || !walletAddress) {
            setError('Both email and wallet address are required.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/loginorg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orgEmail, walletAddress })
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                localStorage.setItem('token', result.token);
                navigate('/admin/dashboard');
            } else {
                const errorResult = await response.json();
                setError(errorResult.error || 'Invalid login credentials');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content">
                <div className="login-org-container">
                    <h2>Organization Admin Login</h2>
                    <form onSubmit={handleLogin} className="login-form">
                        <label>
                            Organization Email:
                            <input
                                type="email"
                                value={orgEmail}
                                onChange={(e) => setOrgEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Admin Wallet Address:
                            <input
                                type="text"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                required
                            />
                        </label>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <button
                        className="signup-redirect-button"
                        onClick={() => navigate('/signuporg')}
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginOrg;
