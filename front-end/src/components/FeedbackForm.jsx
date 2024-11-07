// // import React, { useState } from 'react';
// // import { ethers } from 'ethers';
// // import { contractAddress, contractABI } from '../contractData'; // Adjust the import path as needed

// // const FeedbackForm = () => {
// //     const [entity, setEntity] = useState('');
// //     const [feedbackText, setFeedbackText] = useState('');
// //     const [rating, setRating] = useState(1); // Default rating value
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState('');

// //     const giveFeedback = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setError('');

// //         if (!window.ethereum) {
// //             alert('Please install MetaMask to use this feature.');
// //             return;
// //         }

// //         try {
// //             const provider = new ethers.providers.Web3Provider(window.ethereum);
// //             const signer = provider.getSigner();
// //             const contract = new ethers.Contract(contractAddress, contractABI, signer);

// //             // Call the smart contract's giveFeedback function
// //             const tx = await contract.giveFeedback(entity, feedbackText, rating);
// //             await tx.wait(); // Wait for the transaction to be mined

// //             alert('Feedback submitted successfully!');
// //             setEntity('');
// //             setFeedbackText('');
// //             setRating(1); // Reset rating to default
// //         } catch (err) {
// //             console.error(err);
// //             setError('Transaction failed: ' + err.message);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <form onSubmit={giveFeedback}>
// //             <input
// //                 type="text"
// //                 value={entity}
// //                 onChange={(e) => setEntity(e.target.value)}
// //                 placeholder="Entity Address"
// //                 required
// //             />
// //             <textarea
// //                 value={feedbackText}
// //                 onChange={(e) => setFeedbackText(e.target.value)}
// //                 placeholder="Feedback"
// //                 required
// //             />
// //             <input
// //                 type="number"
// //                 value={rating}
// //                 onChange={(e) => setRating(Number(e.target.value))}
// //                 min="1"
// //                 max="10"
// //                 placeholder="Rating (1-10)"
// //                 required
// //             />
            
// //             <button type="submit" disabled={loading}>
// //                 {loading ? 'Submitting...' : 'Submit Feedback'}
// //             </button>
// //             {error && <p style={{ color: 'red' }}>{error}</p>}
// //         </form>
// //     );
// // };

// // export default FeedbackForm;

// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import { contractAddress, contractABI } from '../Blockchain/contractData';

// const FeedbackForm = ({ hasAccess }) => {
//     const [entity, setEntity] = useState('');
//     const [feedbackText, setFeedbackText] = useState('');
//     const [rating, setRating] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const giveFeedback = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         if (!hasAccess) {
//             setError('You do not have access to submit feedback.');
//             setLoading(false);
//             return;
//         }

//         if (!window.ethereum) {
//             alert('Please install MetaMask to use this feature.');
//             return;
//         }

//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const contract = new ethers.Contract(contractAddress, contractABI, signer);

//             const tx = await contract.giveFeedback(entity, feedbackText, rating);
//             await tx.wait(); // Wait for the transaction to be mined

//             alert('Feedback submitted successfully!');
//             setEntity('');
//             setFeedbackText('');
//             setRating(1); // Reset rating to default
//         } catch (err) {
//             console.error(err);
//             setError('Transaction failed: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={giveFeedback}>
//             <input
//                 type="text"
//                 value={entity}
//                 onChange={(e) => setEntity(e.target.value)}
//                 placeholder="Entity Address"
//                 required
//             />
//             <textarea
//                 value={feedbackText}
//                 onChange={(e) => setFeedbackText(e.target.value)}
//                 placeholder="Feedback"
//                 required
//             />
//             <input
//                 type="number"
//                 value={rating}
//                 onChange={(e) => setRating(Number(e.target.value))}
//                 min="1"
//                 max="10"
//                 placeholder="Rating (1-10)"
//                 required
//             />
//             <button type="submit" disabled={loading}>
//                 {loading ? 'Submitting...' : 'Submit Feedback'}
//             </button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </form>
//     );
// };

// export default FeedbackForm;
