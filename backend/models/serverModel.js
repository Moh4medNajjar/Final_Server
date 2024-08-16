const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    vmName: { type: String, required: true },
    username: { type: String, required: true },
    requesterId: { type: String, required: true }, // Fixed typo here
    requesterName: { type: String, required: true },
    requesterMatricule: { type: String, required: true }, // Fixed typo here
    password: { type: String, required: true },
    environment_type: { type: String, required: true },
    operating_system: { type: String, required: true },
    ram: { type: String, required: true },
    cpu: { type: String, required: true },
    disk_space: { type: String, required: true },
    privateIP: { type: String, required: true },
    subnetMask: { type: String, required: true },
    defaultGateway: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema);
