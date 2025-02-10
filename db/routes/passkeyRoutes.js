const express = require('express');
const router = express.Router();
const Passkey = require('../models/passkeySchema');
const jwt = require('jsonwebtoken'); // Make sure to npm install jsonwebtoken
const crypto = require('crypto'); // Add this line to import the crypto module

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
    
    // Generate JWT
    const token = jwt.sign(
      { email: passkeyDoc.email },
      crypto.randomBytes(32).toString('hex'), // Generate a random secret
      { expiresIn: '1h' }
    );
    
    // Update the document with the JWT
    passkeyDoc.jwt = token;
    passkeyDoc.passkey = null;   //Removing passkey from the database after verification
    await passkeyDoc.save();

    // Delete the passkey document after verification
    
    res.status(200).json({ valid: true, message: 'Passkey verified successfully', token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update JWT after successful passkey verification
router.post('/update-jwt', async (req, res) => {
  try {
    const { email } = req.body;
    const passkeyDoc = await Passkey.findOne({ email });
    
    if (!passkeyDoc) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Generate JWT
    const token = jwt.sign(
      { email: passkeyDoc.email },
      crypto.randomBytes(32).toString('hex'), // Generate a random secret
      { expiresIn: '1h' }
    );

    // Update the document with the JWT
    passkeyDoc.jwt = token;
    await passkeyDoc.save();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kill JWT token
router.post('/kill-jwt', async (req, res) => {
  try {
    const { email } = req.body;
    const passkeyDoc = await Passkey.findOne({ email });
    
    if (!passkeyDoc) {
      return res.status(404).json({ message: 'No active session found' });
    }

    // Clear the JWT
    passkeyDoc.jwt = null;
    await passkeyDoc.save();

    res.status(200).json({ message: 'JWT token successfully cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 