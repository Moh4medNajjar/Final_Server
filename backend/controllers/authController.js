const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { fullName, email, password, position, matricule, phoneNumber, role, permissions } = req.body;
    try {
        const newUser = new User({ fullName, email, password, position, matricule, phoneNumber, role, permissions });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

exports.login = async (req, res) => {
    const { matricule, password } = req.body;
    try {
        const user = await User.findOne({ matricule });
        if (!user) return res.status(404).json({ message: 'Matricule not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Matricule or password invalid' });

        const token = jwt.sign({ id: user._id, role: user.role, fullName: user.fullName, matricule: user.matricule, position: user.position, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
