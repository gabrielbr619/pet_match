const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { authToken } = require('../middlewares/authToken');
const upload = require('../config/multer');
const router = express.Router();

router.post('/', authToken, upload.array('images', 10), sendMessage);
router.get('/:chatId', authToken, getMessages);

module.exports = router;
