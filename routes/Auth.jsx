// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const router = express.Router();

// JWT secret (can also be stored in .env)
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Route for organization signup
router.post('/signuporg', async (req, res) => {
    const { orgName, orgEmail, adminAddresses } = req.body;

    try {
        // Create a new organization and save it in the database
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

// Route for organization login (JWT generation)
router.post('/loginorg', async (req, res) => {
    const { orgEmail, walletAddress } = req.body;

    try {
        // Find the organization by email
        const organization = await Organization.findOne({ orgEmail });

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Check if the wallet address matches any of the admins
        const isAdmin = organization.admins.some(admin => admin.adminAddress === walletAddress);

        if (!isAdmin) {
            return res.status(401).json({ error: 'Invalid wallet address' });
        }

        // Extract the email host (part before '@') from orgEmail
        const emailHost = orgEmail.split('@')[0];

        // Create JWT payload
        const payload = {
            emailHost,   // Part of email before '@'
            walletAddress,
        };

        // Sign the JWT token with secret and set expiration time (1 hour)
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

        // Return the token to the client
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

module.exports = router;
