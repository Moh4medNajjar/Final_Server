const Request = require('../models/requestModel');
const User = require('../models/userModel');

// Create a new request
exports.createRequest = async (req, res) => {
    const { requesterId, matricule, fullName, email, position, environment_type, vmName, description, desired_start_date, operating_system, disk_space, ram, vcpu, software_list, services, status, openPorts, hasPublicIP } = req.body;
    try {
        const newRequest = new Request({ requesterId, matricule, fullName, email, position, environment_type, vmName, description, desired_start_date, operating_system, disk_space, ram, vcpu, software_list, services, status, openPorts, hasPublicIP });
        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating request', error });
    }
};

// Get all requests by user ID
exports.getRequestsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await Request.find({ requesterId: userId });
        if (requests.length === 0) return res.status(404).json({ message: 'No requests found for this user' });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
};


// Get all requests
exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
};

// Get a single request by ID
exports.getRequestById = async (req, res) => {
    try {
        // Validate the ID format if necessary (e.g., if using MongoDB ObjectId)
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid request ID format' });
        }

        // Find the request by ID
        const request = await Request.findById(req.params.id);
        
        // Check if the request was found
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        // Return the found request
        res.status(200).json(request);
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ message: 'Error fetching request', error: error.message });
    }
};


// Update a request by ID
exports.updateRequest = async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request updated successfully', updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request', error });
    }
};

// Delete a request by ID
exports.deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await Request.findByIdAndDelete(req.params.id);
        if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting request', error });
    }
};

// Approve request by GeneralSpecAdmin
exports.approveByGeneralSpecAdmin = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        
        request.status = 'approved';
        await request.save();

        res.status(200).json({ message: 'Request approved by GeneralSpecAdmin', request });
    } catch (error) {
        res.status(500).json({ message: 'Error approving request by GeneralSpecAdmin', error });
    }
};

// Approve request by NetworkAdmin
exports.approveByNetworkAdmin = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = 'Approved by NetworkAdmin';
        await request.save();
        
        // Notify SecurityAdmin
        // (You may add notification logic here)

        res.status(200).json({ message: 'Request approved by NetworkAdmin', request });
    } catch (error) {
        res.status(500).json({ message: 'Error approving request by NetworkAdmin', error });
    }
};

// Approve request by SecurityAdmin
exports.approveBySecurityAdmin = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = 'Approved by SecurityAdmin';
        await request.save();
        
        // Trigger Ansible playbooks for server creation
        // (You may add playbook execution logic here)

        res.status(200).json({ message: 'Request approved by SecurityAdmin', request });
    } catch (error) {
        res.status(500).json({ message: 'Error approving request by SecurityAdmin', error });
    }
};


// Reject a request
exports.rejectRequest = async (req, res) => {
    try {
        console.log('Reject request received for ID:', req.params.id);  // Debugging output

        const request = await Request.findById(req.params.id);
        if (!request) {
            console.log('Request not found');
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = 'rejected';
        await request.save();
        console.log('Request rejected:', request);  // Debugging output

        res.status(200).json({ message: 'Request rejected successfully', request });
    } catch (error) {
        console.error('Error rejecting request:', error);  // Log error to server console
        res.status(500).json({ message: 'Error rejecting request', error: error.message });
    }
};
