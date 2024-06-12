const { createUser,likePet, findUserById, deslikePet } = require('../models/User');
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

exports.userLikePet = async (req, res) => {
  try {
    const { user, pet_id} = req.body;
    const updatedUser = await likePet(user, pet_id)
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.userDeslikePet = async (req, res) => {
  try {
    const { user, pet_id} = req.body;
    const updatedUser = await deslikePet(user, pet_id)
    res.status(201).json(updatedUser);
  }
   catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}