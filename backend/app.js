// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const cors = require('cors');

// Initialize the app
const app = express();

// Load environment variables
dotenv.config();

// Use middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/servers', require('./routes/serverRoutes'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
