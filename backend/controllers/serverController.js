const Server = require('../models/serverModel');

exports.createServer = async (req, res) => {
    const { vmName, environment_type, timeCreated, operating_system, cpu, ram, vCPUs, disk_space, publicIP, cidrRange, status } = req.body;
    try {
        const newServer = new Server({ vmName, environment_type, timeCreated, operating_system, cpu, ram, vCPUs, disk_space, publicIP, cidrRange, status });
        await newServer.save();
        res.status(201).json({ message: 'Server created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating server', error });
    }
};

exports.getServers = async (req, res) => {
    try {
        const servers = await Server.find();
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching servers', error });
    }
};

exports.getServerById = async (req, res) => {
    try {
        const server = await Server.findById(req.params.id);
        if (!server) return res.status(404).json({ message: 'Server not found' });
        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching server', error });
    }
};

exports.updateServer = async (req, res) => {
    try {
        const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedServer) return res.status(404).json({ message: 'Server not found' });
        res.status(200).json({ message: 'Server updated successfully', updatedServer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating server', error });
    }
};

exports.deleteServer = async (req, res) => {
    try {
        const deletedServer = await Server.findByIdAndDelete(req.params.id);
        if (!deletedServer) return res.status(404).json({ message: 'Server not found' });
        res.status(200).json({ message: 'Server deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting server', error });
    }
};
