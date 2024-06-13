const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createMessage = async (chatId, senderId, content, imageUrls) => {
  const id = uuidv4();
  const res = await pool.query(
    'INSERT INTO messages (id, chat_id, sender_id, content, image_urls) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, chatId, senderId, content, imageUrls]
  );
  return res.rows[0];
};

exports.getMessagesByChatId = async (chatId) => {
  const res = await pool.query(
    'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
    [chatId]
  );
  return res.rows;
};
