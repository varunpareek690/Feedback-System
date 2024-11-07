const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const authenticateJWT = require('../middleware/Auth'); // Import the auth middleware
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error connecting to MongoDB', err));

// Register Organization (sign-up)
app.post('/api/signuporg', async (req, res) => {
    const { orgName, orgEmail, adminAddresses } = req.body;

    try {
        const newOrg = new Organization({
            orgName,
            orgEmail,
            admins: adminAddresses.map(addr => ({ adminAddress: addr })),
        });

        await newOrg.save();
        res.status(201).json({ message: 'Organization registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register organization' });
    }
});

// Login Organization and Generate JWT Token
app.post('/api/loginorg', async (req, res) => {
    const { orgEmail, walletAddress } = req.body;

    try {
        // Find the organization by email
        const organization = await Organization.findOne({ orgEmail });
        console.log(organization);

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Check if the wallet address is an admin address
        const isAdmin = organization.admins.some(admin => admin.adminAddress === walletAddress);
        console.log(isAdmin);
        if (!isAdmin) {
            return res.status(401).json({ error: 'Invalid wallet address' });
        }

        // Extract part of the email before '@'
        const emailHost = orgEmail.split('@')[0];

        // JWT Payload
        const payload = {
            emailHost, // Part of the email before '@'
            walletAddress,
        };

        // Sign the JWT token with the secret key from .env
        const token = jwt.sign(payload, 'makaladla', { expiresIn: '1h' });
        console.log(token);
        // Send back the token and authentication status
        res.status(200).json({
            message: 'Login successful',
            isAuthenticated: true,
            token, // Include the token in the response
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
