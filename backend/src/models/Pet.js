const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const selectPetById = async (pet_id) => {
  const res = await pool.query("SELECT * FROM Pets WHERE id = $1", [pet_id]);
  return res.rows[0];
};

const findPets = async ({ specie, breed, gender, userId }) => {
  let query = `
    SELECT pets.*, pet_owners.coordinates 
    FROM pets
    JOIN pet_owners ON pets.owner_id = pet_owners.id
    WHERE 1=1 
      AND pets.id NOT IN (
        SELECT pet_id 
        FROM user_disliked_pets
        WHERE user_id = $1
          AND disliked_at > NOW() - INTERVAL '3 days'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM users
        WHERE id = $1
          AND pets.id = ANY(pets_liked)
      )
  `;

  const params = [userId];

  // Aplicar filtros dinamicamente
  if (specie) {
    params.push(specie);
    query += ` AND pets.specie = $${params.length}`;
  }
  if (breed) {
    params.push(breed);
    query += ` AND pets.breed = $${params.length}`;
  }
  if (gender) {
    params.push(gender);
    query += ` AND pets.gender = $${params.length}`;
  }

  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (err) {
    throw err;
  }
};

const selectAllPetOwnerPets = async (petOwnerId) => {
  const res = await pool.query("SELECT * FROM Pets WHERE owner_id = $1", [
    petOwnerId,
  ]);
  return res.rows;
};

const createPet = async (pet) => {
  const { name, age, description, specie, pictures, owner_id, breed, gender } =
    pet;
  const id = uuidv4();
  const res = await pool.query(
    "INSERT INTO Pets (id, name, age, description, specie, pictures, owner_id, breed, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [id, name, age, description, specie, pictures, owner_id, breed, gender]
  );
  return res.rows[0];
};

const updatePet = async (pet) => {
  const { id, name, age, description, specie, pictures, breed, gender } = pet;
  const res = await pool.query(
    "UPDATE Pets SET name = $2, age = $3, description = $4, specie = $5, pictures = $6, breed = $7, gender = $8 WHERE id = $1 RETURNING *",
    [id, name, age, description, specie, pictures, breed, gender]
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
    // Regras da Query, não viram no select:
    //->  Descurtidos (disliked) nos últimos 3 dias.
    //-> Visualizados (viewed) no último segundo.
    //-> Curtidos (liked) pelo usuário.
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
      AND id != ALL (
          SELECT UNNEST(pets_liked) FROM users 
          WHERE id = $2
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
  findPets,
};
