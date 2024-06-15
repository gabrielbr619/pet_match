const express = require('express');
const { registerPet, deletePet, getRandomPet, userDislikePet } = require('../controllers/petController');
const { authToken } = require('../middlewares/authToken');
const upload = require('../config/multer');
const router = express.Router();

router.get('/randomPet/:userId', authToken, getRandomPet);

router.post('/add', authToken, upload.array('images', 10), registerPet);

router.put('/dislikePet', authToken, userDislikePet);

router.delete('/delete', authToken, deletePet);

module.exports = router;
