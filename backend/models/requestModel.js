const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requesterId: { type: String, required: true },
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    matricule: { type: String, required: true },
    environment_type: { type: String, required: true, enum: ['testing', 'staging', 'developing', 'production'] },
    vmName: { type: String, required: true },
    description: { type: String, required: true },
    desired_start_date: { type: Date, required: true },
    operating_system: { 
        type: String, 
        required: true, 
        enum: ['RHEL 8.4', 'Ubuntu 20.04 LTS', 'Windows Server 2022', 'CentOS 8', 'Debian 11', 'SUSE Linux Enterprise Server 15', 'Oracle Linux 8'] 
    },
    disk_space: { type: String, required: true },
    ram: { type: String, required: true },
    vcpu: { type: String, required: true },
    /***********************************************/ 
    private_ip: { type: String, required: false },
    subnet_mask: { type: String, required: false },
    /***********************************************/ 
    software_list: {type: [String], default: []},
    status: { type: String, enum: ['pending', 'approved', 'approvedByNetworkAdmin','approvedBySecurityAdmin', 'finished', 'rejected'], default: 'pending' },
    openPorts: {type: [String], default: []},
    hasPublicIP: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
