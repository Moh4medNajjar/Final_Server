const Server = require('../models/serverModel');

exports.createServer = async (req, res) => {
    const {
        adminId,
        adminName,
        vmName,
        username,
        requestId,
        requesterId,
        requesterName,
        requesterMatricule, // Ensure this matches the schema
        password,
        environment_type,
        operating_system,
        ram,
        cpu,
        disk_space,
        privateIP,
        subnetMask,
        defaultGateway
    } = req.body;

    try {
        const newServer = new Server({
            adminId,
            adminName,
            vmName,
            username,
            requestId,
            requesterId,
            requesterName,
            requesterMatricule, // Ensure this matches the schema
            password,
            environment_type,
            operating_system,
            ram,
            cpu,
            disk_space,
            privateIP,
            subnetMask,
            defaultGateway
        });

        await newServer.save();
        res.status(201).json({ message: 'Server created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating server', error });
    }
};

exports.getServersByUserId = async (req, res) => {
    try {
      const { requesterId } = req.params;
  
      // Find servers with the matching requesterId
      const servers = await Server.find({ requesterId: requesterId });
  
      // Respond with the servers
      res.status(200).json({ servers });
    } catch (error) {
      console.error('Error fetching servers:', error);
      res.status(500).json({ message: 'Error fetching servers', error });
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


// Request Server Removal
exports.requestRemoveRequest = async (req, res) => {
    try {
      const server = await Server.findById(req.params.id);
      if (!server) {
        console.log('Server not found');
        return res.status(404).json({ message: 'Server not found' });
      }
  
      server.wantToDelete = true;
      await server.save();
      console.log('wantToDelete set to: true');
  
      res.status(200).json({ message: 'Server delete request submitted successfully' });
    } catch (error) {
      console.error('Error submitting delete request:', error);
      res.status(500).json({ message: 'Error submitting delete request', error: error.message });
    }
  };
