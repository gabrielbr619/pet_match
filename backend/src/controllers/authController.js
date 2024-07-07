require('dotenv').config();

const { findUserByEmail } = require('../models/User'); 
const { findPetOwnerByEmail } = require('../models/PetOwner');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginPetOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await findPetOwnerByEmail(email);
    if (!owner || !await bcrypt.compare(password, owner.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: owner.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, owner });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.checkToken = (req, res) => {
  res.status(200).json({ valid: true });
};
