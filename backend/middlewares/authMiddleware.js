const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token is provided, respond with an access denied message
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Log the error details to the console for debugging
    console.error('Token verification failed:', error);

    // Respond with an invalid token message
    res.status(400).json({ message: 'Invalid token' });
  }
};
