const express = require('express');
const { registerPet, deletePet } = require('../controllers/petController');
const { authToken } = require('../middlewares/authToken');
const router = express.Router();

router.post('/add', authToken, registerPet);
router.delete('/delete', authToken, deletePet);


module.exports = router;
