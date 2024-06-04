const { createPetOwner } = require('../models/PetOwner');
const bcrypt = require('bcryptjs');

exports.registerPetOwner = async (req, res) => {
  try {
    const { username, password, email, phone, local, profile_picture } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = await createPetOwner({ username, password: hashedPassword, email, phone, local, profile_picture });
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};