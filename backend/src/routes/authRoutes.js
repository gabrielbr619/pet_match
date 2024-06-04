const express = require('express');
const { loginUser, loginPetOwner } = require('../controllers/authController');
const router = express.Router();

router.post('/login/user', loginUser);
router.post('/login/petowner', loginPetOwner);

module.exports = router;