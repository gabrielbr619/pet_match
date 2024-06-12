const pool = require('../config/db');
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

const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
  return res.rows[0];
}

const findUserById = async (id) => {
  const res = await pool.query(`select * from users u where id = '${id}'`);
  return res.rows[0];
}

const likePet = async (user, pet_id) => {
  const res = await pool.query(
    `UPDATE users SET pets_liked = array_append(pets_liked, $1) WHERE id = $2 RETURNING *;`,[pet_id, user.id])
  return res.rows[0];
}

const deslikePet = async (user, pet_id) => {
  const res = await pool.query(
    `UPDATE users SET pets_liked = array_remove(pets_liked, $1) WHERE id = $2 RETURNING *;`,[pet_id, user.id])
  return res.rows[0];
}

module.exports = { createUser, findUserByEmail, likePet, findUserById, deslikePet };