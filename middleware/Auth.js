// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(403).json({ error: 'Token not provided' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    }catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }


};

module.exports = authenticateJWT;
