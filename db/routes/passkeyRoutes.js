const express = require('express');
const router = express.Router();
const Passkey = require('../models/passkeySchema');

// Store a new passkey
router.post('/', async (req, res) => {
  // This route handles POST requests to /api/passkeys/
  // It stores a new passkey in the database
  // Example call: POST http://localhost:3001/api/passkeys
  // with body: { "email": "user@example.com", "passkey": "abc123" }
  try {
    const { email, passkey } = req.body;
    
    // Remove any existing passkey for this email
    await Passkey.deleteMany({ email });
    
    // Create new passkey document
    const passkeyDoc = new Passkey({ email, passkey });
    const savedPasskey = await passkeyDoc.save();
    
    res.status(201).json(savedPasskey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify a passkey
router.post('/verify', async (req, res) => {
  // This route handles POST requests to /api/passkeys/verify
  // It checks if a passkey is valid for a given email
  // Example call: POST http://localhost:3001/api/passkeys/verify
  // with body: { "email": "user@example.com", "passkey": "abc123" }
  try {
    const { email, passkey } = req.body;
    const passkeyDoc = await Passkey.findOne({ email, passkey });
    
    if (!passkeyDoc) {
      return res.status(401).json({ valid: false, message: 'Invalid or expired passkey' });
    }
    
    // Optionally delete the passkey after successful verification
    await Passkey.deleteOne({ _id: passkeyDoc._id });
    
    res.status(200).json({ valid: true, message: 'Passkey verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

module.exports = router; 