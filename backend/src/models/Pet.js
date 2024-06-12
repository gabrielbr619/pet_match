const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

const createPet = async (pet) => {
  const { name, age, description, race, pictures, owner_id } = pet;
  const id = uuidv4();
  const res = await pool.query(
    'INSERT INTO Pets (id, name, age, description, race, pictures, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [id, name, age, description, race, pictures, owner_id]
  );
  return res.rows[0];
};

module.exports = { createPet };