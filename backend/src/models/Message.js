const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createMessage = async (chatId, senderId, content, imageUrls) => {
  const id = uuidv4();


  const res = await pool.query(
    'INSERT INTO messages (id, chat_id, sender_id, content, image_urls) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, chatId, senderId, content, imageUrls]
  );

  const newMessage = res.rows[0];

  await pool.query(
    'UPDATE chats SET last_message_sent = $1 WHERE id = $2',
    [newMessage.id, chatId]
  );
  return newMessage;
};

exports.getMessagesByChatId = async (chatId) => {
  const res = await pool.query(
    'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at DESC',
    [chatId]
  );
  return res.rows;
};

exports.getMessageById = async (messageId) => {
  const res = await pool.query(
    'SELECT * FROM messages WHERE id = $1',
    [messageId]
  );
  return res.rows[0];
}