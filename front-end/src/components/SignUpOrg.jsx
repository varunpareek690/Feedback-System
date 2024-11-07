import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/SignUpOrg.css'; // Import CSS for styling
import Navbar from './Navbar';
import Footer from './Footer';

const SignUpOrg = () => {
    const [orgName, setOrgName] = useState('');
    const [orgEmail, setOrgEmail] = useState('');
    const [adminAddresses, setAdminAddresses] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddAdminAddress = () => {
        setAdminAddresses([...adminAddresses, '']);
    };

    const handleRemoveAdminAddress = (index) => {
        const newAdminAddresses = adminAddresses.filter((_, i) => i !== index);
        setAdminAddresses(newAdminAddresses);
    };

    const handleAddressChange = (index, value) => {
        const newAdminAddresses = [...adminAddresses];
        newAdminAddresses[index] = value;
        setAdminAddresses(newAdminAddresses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orgName || !orgEmail || adminAddresses.some(addr => !addr)) {
            setError('All fields are required, including at least one admin address.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signuporg`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orgName,
                    orgEmail,
                    adminAddresses
                })   
            });

            if(response.ok){
                const result = await response.json();
                console.log(result.message);
                navigate('/dashboard');
            }

            else{
                const errorResult = await response.json();
                setError(errorResult.error || 'Failed to register organization');

            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        console.error(error);
        }
        finally{
            setLoading(false);
        }

        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content">
                <div className="signup-org-container">
                    <h2>Organization Sign-Up</h2>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <label>
                            Organization Name:
                            <input
                                type="text"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Organization Email:
                            <input
                                type="email"
                                value={orgEmail}
                                onChange={(e) => setOrgEmail(e.target.value)}
                                required
                            />
                        </label>
                        <div className="admin-addresses">
                            <h3>Admin Wallet Addresses:</h3>
                            {adminAddresses.map((address, index) => (
                                <div key={index} className="admin-address-group">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleAddressChange(index, e.target.value)}
                                        required
                                        placeholder={`Admin Address #${index + 1}`}
                                    />
                                    <button type="button" onClick={() => handleRemoveAdminAddress(index)} className="remove-button">
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddAdminAddress} className="add-button">
                                Add Another Admin Address
                            </button>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Registering...' : 'Register Organization'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUpOrg;
