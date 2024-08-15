const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    const { fullName, email, position, matricule, phoneNumber, role, permissions, password } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.position = position || user.position;
        user.matricule = matricule || user.matricule;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.role = role || user.role;
        user.permissions = permissions || user.permissions;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user: user.select('-password') });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
