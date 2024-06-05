const { createPet } = require('../models/Pet');

exports.registerPet = async (req, res) => {
  try {
    const { name, age, description, race, pictures } = req.body;
    const pet = await createPet({ name, age, description, race, pictures });
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};