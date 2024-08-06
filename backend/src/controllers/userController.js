const { createUser, likePet, findUserById, deslikePet, updateUserById } = require('../models/User');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const streamifier = require('streamifier');
const { checkIfAlreadyExists } = require('../helpers/checkIfExists');
const { uploadSinglePicture } = require('../helpers/uploadPictures');
const { createChat } = require('../models/Chat');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userAlreadyExist = await checkIfAlreadyExists(email,"email","users")

    if(userAlreadyExist)
      return res.status(400).json({ error: "User already exists" });

    let profile_picture = null;

    if (req.file) {
      try {
        profile_picture = await uploadSinglePicture(req,"profile_pictures")
      } catch (error) {
       console.error(error) 
      }
    }

    const user = await createUser({ username, password: hashedPassword, email, phone, profile_picture });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, username, password, email, phone } = req.body;
    let profile_picture = null;

    if (req.file) {
      try {
        profile_picture = await uploadSinglePicture(req,"profile_pictures")
      } catch (error) {
       console.error(error) 
      }
    }

    const user = await updateUserById (id, { 
      username, 
      password: password ? await bcrypt.hash(password, 10) : undefined, // Se a senha foi fornecida, atualiza-a
      email, 
      phone, 
      profile_picture // Inclui a imagem de perfil atualizada
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.userLikePet = async (req, res) => {
  try {
    const { user_data, pet_id, pet_owner_id} = req.body;
    const updatedUser = await likePet(user_data, pet_id)
    const chatCreated = await createChat(user_data.id, pet_owner_id, pet_id)
    res.status(201).json({updatedUser, chatCreated});
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