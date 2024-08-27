const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const selectPetById = async (pet_id) => {
  const res = await pool.query("SELECT * FROM Pets WHERE id = $1", [pet_id]);
  return res.rows[0];
};

const selectAllPetOwnerPets = async (petOwnerId) => {
  const res = await pool.query("SELECT * FROM Pets WHERE owner_id = $1", [
    petOwnerId,
  ]);
  return res.rows;
};

const createPet = async (pet) => {
  const { name, age, description, specie, pictures, owner_id, breed } = pet;
  const id = uuidv4();
  const res = await pool.query(
    "INSERT INTO Pets (id, name, age, description, specie, pictures, owner_id, breed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [id, name, age, description, specie, pictures, owner_id, breed]
  );
  return res.rows[0];
};

const updatePet = async (pet) => {
  const { id, name, age, description, specie, pictures, breed } = pet;
  const res = await pool.query(
    "UPDATE Pets SET name = $2, age = $3, description = $4, specie = $5, pictures = $6, breed = $7 WHERE id = $1 RETURNING *",
    [id, name, age, description, specie, pictures, breed]
  );
  return res.rows[0];
};

const deletePet = async (pet_id) => {
  const res = await pool.query("DELETE FROM Pets WHERE id = $1 RETURNING *", [
    pet_id,
  ]);
  return res.rows[0];
};
const getRandomPetForUser = async (user_id, last_pet_id) => {
  try {
    const res = await pool.query(
      `
      SELECT * FROM pets 
      WHERE id != $1
      AND id NOT IN (
          SELECT pet_id FROM user_disliked_pets 
          WHERE user_id = $2 AND disliked_at > NOW() - INTERVAL '3 days'
      )
      AND id NOT IN (
          SELECT pet_id FROM user_viewed_pets 
          WHERE user_id = $2 AND last_viewed > NOW() - INTERVAL '1 second'
      )
      ORDER BY RANDOM()
      LIMIT 1;
       `,
      [last_pet_id, user_id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
  }
};

const markPetAsViewed = async (user_id, pet_id) => {
  await pool.query(
    "INSERT INTO user_viewed_pets (user_id, pet_id) VALUES ($1, $2) ON CONFLICT (user_id, pet_id) DO UPDATE SET last_viewed = CURRENT_TIMESTAMP",
    [user_id, pet_id]
  );
};

const dislikePet = async (user_id, pet_id) => {
  await pool.query(
    "INSERT INTO UserDislikedPets (user_id, pet_id) VALUES ($1, $2) ON CONFLICT (user_id, pet_id) DO UPDATE SET disliked_at = CURRENT_TIMESTAMP",
    [user_id, pet_id]
  );
};

module.exports = {
  selectPetById,
  createPet,
  deletePet,
  updatePet,
  getRandomPetForUser,
  dislikePet,
  markPetAsViewed,
  selectAllPetOwnerPets,
};
