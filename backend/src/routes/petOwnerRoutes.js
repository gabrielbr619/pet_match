const express = require('express');
const { loginPetOwner } = require('../controllers/authController');
const { registerPetOwner } = require('../controllers/petOwnerController');
const router = express.Router();

router.post('/register', registerPetOwner);
router.post('/login', loginPetOwner);

module.exports = router;
