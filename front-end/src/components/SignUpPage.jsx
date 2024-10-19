import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { authContractAddress, authContractABI } from '../Blockchain/contractData';
import '../CSS/SignUpPage.css';
import Footer from './Footer';
import Navbar from './Navbar';

const SignUpPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [connectedAccount, setConnectedAccount] = useState(null); // State for connected account
    const navigate = useNavigate();

    const handleConnectWallet = async () => {
        setLoading(true);
        setError('');

        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature.');
            setLoading(false);
            return;
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress(); // Get the connected wallet address
            setConnectedAccount(address); // Set the connected account

            // Create a contract instance
            const contract = new ethers.Contract(authContractAddress, authContractABI, signer);

            // Check if the user has the special token
            const hasAccess = await contract.hasAccess(address);
            if (hasAccess) {
                alert('Access granted! Redirecting to dashboard...');
                navigate('/dashboard'); // Redirect to dashboard on successful access
            } else {
                alert('Access denied! You do not have the required tokens.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting wallet: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Effect to check for connected account
    useEffect(() => {
        const checkConnectedAccount = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setConnectedAccount(accounts[0]); // Set the connected account
                } else {
                    setConnectedAccount(null); // No account connected
                }
            }
        };

        checkConnectedAccount();

        // Event listener for account change
        window.ethereum.on('accountsChanged', checkConnectedAccount);

        // Clean up the event listener on unmount
        return () => {
            window.ethereum.removeListener('accountsChanged', checkConnectedAccount);
        };
    }, []);

    return (
        <div className="signup-container">
            <Navbar />
            <div className="content_signup">
                <h2 className="title">Join Our Decentralized Feedback Platform</h2>
                <p className="description">
                    Sign up by connecting your crypto wallet. No email or password required!
                </p>
                <button className="auth-button" onClick={handleConnectWallet} disabled={loading}>
                    {connectedAccount ? 'Connected' : (loading ? 'Connecting...' : 'Connect Wallet')}
                    

                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p className="wallet-support">
                    Supported Wallets: MetaMask, WalletConnect, Coinbase Wallet
                </p>
                <div className="nft-info">
                    <h3>Access Control with NFTs</h3>
                    <p>
                        Owning a specific NFT grants you access to the platform.
                        This ensures security and trust through verified ownership.
                    </p>
                    <a href="https://your-nft-marketplace.com" target="_blank" rel="noopener noreferrer" className="marketplace-link">
                        Learn how to obtain the required NFT
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUpPage;
