const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

const createUser = async (user) => {
  const { username, password, email, phone, profile_picture } = user;
  const id = uuidv4();
  const res = await pool.query(
    'INSERT INTO Users (id, username, password, email, phone, profile_picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, username, password, email, phone, profile_picture]
  );
  return res.rows[0];
};

module.exports = { createUser };