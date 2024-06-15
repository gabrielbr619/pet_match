const express = require('express');
const { authToken } = require('../middlewares/authToken');
const { checkToken } = require('../controllers/authController');
const router = express.Router();

router.get('/check-token', authToken, checkToken);

module.exports = router;