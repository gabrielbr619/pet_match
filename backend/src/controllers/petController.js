const { createPet, deletePet } = require('../models/Pet');

exports.registerPet = async (req, res) => {
  try {
    const { name, age, description, race, pictures,owner_id } = req.body;
    const pet = await createPet({ name, age, description, race, pictures, owner_id });
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { pet_id } = req.body;
    const pet = await deletePet( pet_id );
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};