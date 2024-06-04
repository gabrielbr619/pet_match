const { createUser } = require('../models/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, phone, profile_picture } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ username, password: hashedPassword, email, phone, profile_picture });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};