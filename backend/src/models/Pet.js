const pool = require('./db');

const createPet = async (pet) => {
  const { name, age, description, race, pictures } = pet;
  const res = await pool.query(
    'INSERT INTO Pets (name, age, description, race, pictures) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, age, description, race, pictures]
  );
  return res.rows[0];
};

module.exports = { createPet };