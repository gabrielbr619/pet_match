const express = require('express');
const { registerPetOwner } = require('../controllers/petOwnerController');
const router = express.Router();

router.post('/register', registerPetOwner);

module.exports = router;