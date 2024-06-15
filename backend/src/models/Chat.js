const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createChat = async (userId, petOwnerId, petId) => {
  const id = uuidv4();
  const res = await pool.query(
    'INSERT INTO chats (id, user_id, pet_owner_id, pet_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, userId, petOwnerId, petId]
  );
  return res.rows[0];
};

exports.getChatByIds = async (userId, petOwnerId, petId) => {
  const res = await pool.query(
    'SELECT * FROM chats WHERE user_id = $1 AND pet_owner_id = $2 AND pet_id = $3',
    [userId, petOwnerId, petId]
  );
  return res.rows[0];
};

exports.getUserChats = async (userId) =>{
  const res = await pool.query(
    'SELECT * FROM chats WHERE user_id = $1',
    [userId]
  );
  return res.rows;
}
