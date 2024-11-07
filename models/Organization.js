// models/Organization.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminAddress: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin'  
    }
});

const OrganizationSchema = new mongoose.Schema({
    orgName: {
        type: String,
        required: true,
    },
    orgEmail: {
        type: String,
        required: true,
        unique:true
    },
    admins: [adminSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
