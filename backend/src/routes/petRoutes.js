const express = require('express');
const { registerPet } = require('../controllers/petController');
const router = express.Router();

router.post('/register', registerPet);

module.exports = router;