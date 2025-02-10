const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const policyRoutes = require('./routes/policyRoutes');
const userRoutes = require('./routes/userRoutes');
const passkeyRoutes = require('./routes/passkeyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas - Policy Database');
    
    // Get reference to the database
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Successfully connected !');
    });
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/policies', policyRoutes);
// Handles all policy-related operations like:
// - Creating new policies
// - Getting policy lists
// - Updating policies
// - Deleting policies

app.use('/api/users', userRoutes);
// Handles all user-related operations like:
// - Creating new users
// - Getting user information
// - Updating user details
// - Checking user email exists

app.use('/api/passkeys', passkeyRoutes);
// Handles passkey operations:
// - Storing temporary passkeys
// - Verifying passkeys

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 