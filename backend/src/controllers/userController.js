const { createUser,likePet, findUserById, deslikePet } = require('../models/User');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');
const streamifier = require('streamifier');
const { checkIfAlreadyExists } = require('../helpers/checkIfExists');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userAlreadyExist = await checkIfAlreadyExists(email,"email","users")

    if(userAlreadyExist)
      return res.status(400).json({ error: "User already exists" });

    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    let profile_picture = null;
    console.log(req.file.buffer)

    if (req.file) {
      console.log('File buffer:', req.file.buffer);

      if (!req.file.buffer) {
        throw new Error('File buffer is undefined');
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'profile_pictures' },
          (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              return reject(new Error('Error uploading image to Cloudinary'));
            }
            console.log('Upload result:', result);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      profile_picture = result.secure_url;
    }

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

// exports.editUser = async (req, res) => {
//   try {
//     const { username, password, email, phone, profile_picture } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

    
//     let profile_picture = null;

//     if (req.file) {
//       const result = await cloudinary.uploader.upload_stream({ folder: 'profile_pictures' }, (error, result) => {
//         if (error) {
//           throw new Error('Error uploading image to Cloudinary');
//         }
//         return result;
//       }).end(req.file.buffer);

//       profile_picture = result.secure_url;
//     }

//     const user = await createUser({ username, password: hashedPassword, email, phone, profile_picture });
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }