// src/components/AuthForm.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { authContractAddress, authContractABI } from "../contractData"; // Adjust import path as needed

const AuthForm = () => {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasAccess, setHasAccess] = useState(false);

    const handleMint = async () => {
        setLoading(true);
        setError("");
        if (!window.ethereum) {
            alert("Please install MetaMask to use this feature.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(authContractAddress, authContractABI, signer);

            // Call the mint function to give access
            const tx = await contract.mint(address);
            await tx.wait(); // Wait for the transaction to be mined

            alert("NFT Minted Successfully! You now have access.");
            setHasAccess(true);
        } catch (err) {
            console.error(err);
            setError("Minting failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkAccess = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to use this feature.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(authContractAddress, authContractABI, signer);

            const access = await contract.hasAccess(address);
            setHasAccess(access);
        } catch (err) {
            console.error(err);
            setError("Error checking access: " + err.message);
        }
    };

    return (
        <div>
            <h2>Authentication</h2>
            <input
                type="text"
                placeholder="Enter Your Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={handleMint} disabled={loading}>
                {loading ? "Minting..." : "Mint NFT"}
            </button>
            <button onClick={checkAccess}>Check Access</button>
            {hasAccess && <p>You have access to give feedback!</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AuthForm;
