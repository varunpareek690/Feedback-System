import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../Blockchain/contractData";

const ListEntityForm = () => {
    const [entityAddress, setEntityAddress] = useState("");
    const [status, setStatus] = useState("");

    const listEntity = async (event) => {
        event.preventDefault();

        if (!entityAddress) {
            setStatus("Please enter an entity address.");
            return;
        }

        // Connect to the Ethereum provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            // Call the listEntity function
            const tx = await contract.listEntity(entityAddress);
            await tx.wait(); // Wait for the transaction to be mined

            setStatus(`Entity ${entityAddress} listed successfully!`);
        } catch (error) {
            console.error("Error listing entity:", error);
            setStatus("Failed to list entity. Check console for details.");
        }
    };

    return (
        <div>
            <form onSubmit={listEntity}>
                <h2>List an Entity</h2>
                <input
                    type="text"
                    placeholder="Enter Entity Address"
                    value={entityAddress}
                    onChange={(e) => setEntityAddress(e.target.value)}
                />
                <button type="submit">List Entity</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default ListEntityForm;
