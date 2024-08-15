const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    vmName: { type: String, required: true },
    environment_type: { type: String, required: true },
    operating_system: { type: String, required: true },
    cpu: { type: String, required: true },
    ram: { type: String, required: true },
    vCPUs: { type: String, required: true },
    disk_space: { type: String, required: true },
    private: { type: String, required: true },
    status: { type: String, required: true, enum: ['running', 'stopped'] }
});

module.exports = mongoose.model('Server', serverSchema);
