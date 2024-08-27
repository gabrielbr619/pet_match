const pool = require("../config/db");
const { uploadManyPictures } = require("../helpers/uploadPictures");
const {
  createPet,
  deletePet,
  getRandomPetForUser,
  markPetAsViewed,
  dislikePet,
  updatePet,
} = require("../models/Pet");
const { RegisterPetOnPetOwner } = require("../models/PetOwner");

exports.registerPet = async (req, res) => {
  try {
    const { name, age, description, specie, breed, owner_id } = req.body;

    let pictures = [];

    if (req.files) {
      pictures = await uploadManyPictures(req, "pet_pictures");
    }

    const pet = await createPet({
      name,
      age,
      description,
      specie,
      breed,
      pictures,
      owner_id,
    });

    await RegisterPetOnPetOwner(owner_id, pet.id);

    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePetById = async (req, res) => {
  try {
    const { id, name, age, description, specie, breed } = req.body;

    let pictures = [];

    if (req.files) {
      pictures = await uploadManyPictures(req, "pet_pictures");
    }

    const updatedPet = await updatePet({
      id,
      name,
      age,
      description,
      specie,
      breed,
      pictures: pictures.length > 0 ? pictures : req.body.existingPictures, // Se não houverem novas imagens, manter as existentes
    });

    res.status(200).json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { pet_id } = req.body;
    const pet = await deletePet(pet_id);
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRandomPet = async (req, res) => {
  try {
    const { userId: user_id } = req.params;

    const lastViewedRes = await pool.query(
      "SELECT pet_id FROM user_viewed_pets WHERE user_id = $1 ORDER BY last_viewed DESC LIMIT 1",
      [user_id]
    );
    const last_pet_id =
      lastViewedRes.rows.length > 0
        ? lastViewedRes.rows[0].pet_id
        : "11111111-1111-1111-1111-111111111111";

    const pet = await getRandomPetForUser(user_id, last_pet_id);

    if (!pet) {
      return res.status(404).json({ message: "No more pets available" });
    }

    //await markPetAsViewed(user_id, pet.id);

    res.status(200).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message }, "getRandomPet");
  }
};

exports.userDislikePet = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { pet_id } = req.body;
    await dislikePet(user_id, pet_id);
    res.status(201).json({ message: "Pet disliked successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
