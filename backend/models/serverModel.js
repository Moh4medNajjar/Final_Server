    const mongoose = require('mongoose');

    const serverSchema = new mongoose.Schema({
        adminId: { type: String, required: true },
        adminName: { type: String, required: true },
        vmName: { type: String, required: true },
        username: { type: String, required: true },
        requestId: { type: String, required: true },
        requesterId: { type: String, required: true }, 
        requesterName: { type: String, required: true },
        requesterMatricule: { type: String, required: true },
        password: { type: String, required: true },
        environment_type: { type: String, required: true },
        operating_system: { type: String, required: true },
        ram: { type: String, required: true },
        cpu: { type: String, required: true },
        disk_space: { type: String, required: true },
        privateIP: { type: String, required: true },
        subnetMask: { type: String, required: true },
        defaultGateway: { type: String, required: true },
        wantToDelete: { type: Boolean, default: false }
    }, { timestamps: true });

    module.exports = mongoose.model('Server', serverSchema);
