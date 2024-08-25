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
        console.log('Status being updated:', req.body.status);
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

// Approve request by NetworkAdmin
exports.approveByNetworkAdmin = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = 'finished';
        await request.save();

        res.status(200).json({ message: 'Request is finished', request });
    } catch (error) {
        res.status(500).json({ message: 'Error finishing', error });
    }
};

// Approve request by SecurityAdmin
exports.approveBySecurityAdmin = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = 'Approved by SecurityAdmin';
        await request.save();

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
        console.log('Request rejected:', request); 

        res.status(200).json({ message: 'Request rejected successfully', request });
    } catch (error) {
        console.error('Error rejecting request:', error);  
        res.status(500).json({ message: 'Error rejecting request', error: error.message });
    }
};
/****************************************************************************/
exports.getNumberOfRequests = async (req, res) => {
    try {
    const totalRequests = await Request.countDocuments();

    res.json({
        numberOfAllRequests: totalRequests,
    });
    } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
    }
};

    exports.getNumberOfApprovedRequests = async (req, res) => {
        try {
        const totalRequests = await Request.countDocuments();
        const approvedRequests = await Request.countDocuments({ status: 'approved' });
    
        const percentage = (approvedRequests / totalRequests) * 100;
    
        res.json({
            numberOfApprovedRequests: approvedRequests,
            percentageOfApprovedRequests: percentage.toFixed(2) // Round to 2 decimal places
        });
        } catch (error) {
        res.status(500).json({ message: 'Error fetching approved requests', error });
        }
    };
    
    // Function to get the number and percentage of rejected requests
    exports.getNumberOfRejectedRequests = async (req, res) => {
        try {
        const totalRequests = await Request.countDocuments();
        const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
    
        const percentage = (rejectedRequests / totalRequests) * 100;
    
        res.json({
            numberOfRejectedRequests: rejectedRequests,
            percentageOfRejectedRequests: percentage.toFixed(2) // Round to 2 decimal places
        });
        } catch (error) {
        res.status(500).json({ message: 'Error fetching rejected requests', error });
        }
    };
    
    // Function to get the number and percentage of finished requests
    exports.getNumberOfFinishedRequests = async (req, res) => {
        try {
        const totalRequests = await Request.countDocuments();
        const finishedRequests = await Request.countDocuments({ status: 'finished' });
    
        const percentage = (finishedRequests / totalRequests) * 100;
    
        res.json({
            numberOfFinishedRequests: finishedRequests,
            percentageOfFinishedRequests: percentage.toFixed(2) // Round to 2 decimal places
        });
        } catch (error) {
        res.status(500).json({ message: 'Error fetching finished requests', error });
        }
    };
    
    // Function to get the number and percentage of pending requests
    exports.getNumberOfPendingRequests = async (req, res) => {
        try {
        const totalRequests = await Request.countDocuments();
        const pendingRequests = await Request.countDocuments({ status: 'pending' });
    
        const percentage = (pendingRequests / totalRequests) * 100;
    
        res.json({
            numberOfPendingRequests: pendingRequests,
            percentageOfPendingRequests: percentage.toFixed(2) // Round to 2 decimal places
        });
        } catch (error) {
        res.status(500).json({ message: 'Error fetching pending requests', error });
        }
    };