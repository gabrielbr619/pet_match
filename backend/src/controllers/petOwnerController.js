const { checkIfAlreadyExists } = require("../helpers/checkIfExists");
const { uploadSinglePicture } = require("../helpers/uploadPictures");
const { selectAllPetOwnerPets } = require("../models/Pet");
const { createPetOwner, updatePetOwnerById } = require("../models/PetOwner");
const bcrypt = require("bcryptjs");

exports.getAllPetsPetOwner = async (req, res) => {
  try {
    const { petOwnerId } = req.params;

    const pets = await selectAllPetOwnerPets(petOwnerId);
    res.status(200).json(pets);
  } catch (error) {}
};

exports.registerPetOwner = async (req, res) => {
  try {
    const { username, password, email, phone, local } = req.body;

    const petOwnerAlreadyExist = await checkIfAlreadyExists(
      email,
      "email",
      "pet_owners"
    );

    if (petOwnerAlreadyExist)
      return res.status(400).json({ error: "Pet OWner already exists" });

    let profile_picture = null;

    if (req.file) {
      try {
        profile_picture = await uploadSinglePicture(req, "profile_pictures");
      } catch (error) {
        console.error(error);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = await createPetOwner({
      username,
      password: hashedPassword,
      email,
      phone,
      local,
      profile_picture,
    });
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePetOwner = async (req, res) => {
  try {
    const { id, username, password, email, phone } = req.body;
    let profile_picture = null;

    if (req.file) {
      try {
        profile_picture = await uploadSinglePicture(req, "profile_pictures");
      } catch (error) {
        console.error(error);
      }
    }

    const petOwner = await updatePetOwnerById(id, {
      username,
      password: password ? await bcrypt.hash(password, 10) : undefined, // Se a senha foi fornecida, atualiza-a
      email,
      phone,
      profile_picture, // Inclui a imagem de perfil atualizada
    });

    res.status(200).json(petOwner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
