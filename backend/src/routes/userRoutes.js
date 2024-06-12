const express = require('express');

const { authToken } = require('../middlewares/authToken');
const { registerUser, userLikePet, getUser, userDeslikePet } = require('../controllers/userController');
const { loginUser } = require('../controllers/authController');
const upload = require('../config/multer');

const router = express.Router();

router.get('/getUser/:id',authToken, getUser);

router.post('/register',upload.single('avatar'), registerUser);
router.post('/login', loginUser);

router.put('/likePet', authToken, userLikePet);
router.put('/deslikePet', authToken, userDeslikePet);

// router.post('/test',upload.single('avatar'),(req, res)=>{
//     console.log(req.body)

//     try {
//     //console.log(req.body,req.file, req.files);
//         res.status(200).send("foi?")
//     } catch (error) {
//         res.status(400).send(error)
        
//     }
// })

module.exports = router;
