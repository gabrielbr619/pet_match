const express = require('express');
const { initiateChat } = require('../controllers/chatController');
const { authToken } = require('../middlewares/authToken');
const router = express.Router();

router.post('/', authToken, initiateChat);

module.exports = router;
