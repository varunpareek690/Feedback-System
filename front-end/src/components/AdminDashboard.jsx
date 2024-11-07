// // src/components/LoginOrg.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { ethers } from 'ethers';
// import { authContractABI, authContractAddress } from '../Blockchain/contractData';
// import Navbar from './Navbar';
// import Footer from './Footer';
// const AdminDashboard = () => {
//     const [walletAddress, setWalletAddress] = useState('');
//     const [userWallet, setUserWallet] = useState('');
//     const [message, setMessage] = useState('');

  

//     // Grant AccessNFT to User
//     const handleGrantAccessNFT = async () => {
//         try {
//             // Initialize ethers.js provider and signer
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []); // Prompt user to connect wallet
//             const signer = provider.getSigner();

//             // Access the contract
//             const contract = new ethers.Contract(authContractAddress, authContractABI, signer);

//             // Generate a random tokenId (or use specific logic if needed)
//             const tokenId = ethers.BigNumber.from(ethers.utils.randomBytes(4)).toString();

//             // Sign and send the transaction to grant the NFT
//             const tx = await contract.mintNFT(userWallet);
//             await tx.wait();

//             setMessage(`Access NFT granted to ${userWallet}. Transaction hash: ${tx.hash}`);
//         } catch (error) {
//             setMessage('Failed to grant Access NFT: ' + error.message);
//         }
//     };
//     const handleLogout = () => {
//       //Do something
//     }

//     return (
//       <>
//         <div>
//             <Navbar showAuthButtons={true} buttonName='Log out' onClick={handleLogout}/>
//             <h2>Grant Access NFT</h2>
//             <input
//                 type="text"
//                 placeholder="User Wallet Address"
//                 value={userWallet}
//                 onChange={(e) => setUserWallet(e.target.value)}
//             />
//             <button className ='auth-button'onClick={handleGrantAccessNFT}>Grant Access NFT</button>

//             {message && <p>{message}</p>}
//         </div>
//           <Footer/>
//         </>
//     );
// };

// export default AdminDashboard;




// src/components/AdminDashboard.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { authContractABI, authContractAddress } from '../Blockchain/contractData';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import '../CSS/AdminDashboard.css'; // Importing CSS for AdminDashboard

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userWallet, setUserWallet] = useState('');
    const [message, setMessage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '']); // Two default options

    // Grant AccessNFT to User
    const handleGrantAccessNFT = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(authContractAddress, authContractABI, signer);
            const tx = await contract.mintNFT(userWallet);
            await tx.wait();
            setMessage(`Access NFT granted to ${userWallet}. Transaction hash: ${tx.hash}`);
        } catch (error) {
            setMessage('Failed to grant Access NFT: ' + error.message);
        }
    };

    // Handle adding a question
    const handleAddQuestion = () => {
        if (questionText.trim() && options.every(option => option.trim())) {
            setQuestions([...questions, { questionText, options }]);
            setQuestionText('');
            setOptions(['', '']); // Reset options
        }
    };

    // Handle options change
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/loginorg');
        // Logout logic
    }

    return (
        <div className="page-container">
            <Navbar showAuthButtons={true} buttonName='Log out' onClick={handleLogout}/>
            <div className="page-content">
                <h2>Grant Access NFT</h2>
                <input
                    type="text"
                    placeholder="User Wallet Address"
                    value={userWallet}
                    onChange={(e) => setUserWallet(e.target.value)}
                />
                <button className='auth-button' onClick={handleGrantAccessNFT}>Grant Access NFT</button>
                {message && <p>{message}</p>}
                
                <div className="feedback-form">
                    <h3>Create Feedback Form</h3>
                    <input
                        type="text"
                        placeholder="Question"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    />
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                    ))}
                    <button onClick={() => setOptions([...options, ''])}>Add Option</button>
                    <button onClick={handleAddQuestion}>Add Question</button>

                    <div className="questions-list">
                        {questions.map((q, index) => (
                            <div key={index} className="question-item">
                                <p>{q.questionText}</p>
                                <ul>
                                    {q.options.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminDashboard;