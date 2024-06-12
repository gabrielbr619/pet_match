const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

const createPetOwner = async (owner) => {
  const { username, password, email, phone, local, profile_picture } = owner;
  const id = uuidv4();
  const res = await pool.query(
    'INSERT INTO Pet_owners (id, username, password, email, phone, local, profile_picture) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
    [id, username, password, email, phone, local, profile_picture]
  );
  return res.rows[0];
};

const findPetOwnerByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM Pet_owners WHERE email = $1', [email]);
  return res.rows[0];
}

module.exports = { createPetOwner, findPetOwnerByEmail };