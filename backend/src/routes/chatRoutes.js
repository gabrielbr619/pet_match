const express = require('express');
const { initiateChat, getUserChats } = require('../controllers/chatController');
const { authToken } = require('../middlewares/authToken');
const router = express.Router();

router.post('/', authToken, initiateChat);
router.get('/getUserChats/:id', authToken, getUserChats)

module.exports = router;
