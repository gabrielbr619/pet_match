const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const selectPetOwnerById = async (id) => {
  const res = await pool.query("SELECT * FROM Pet_owners WHERE id = $1", [id]);
  return res.rows[0];
};

const createPetOwner = async (owner) => {
  const { username, password, email, phone, local, profile_picture } = owner;
  const id = uuidv4();
  const res = await pool.query(
    "INSERT INTO Pet_owners (id, username, password, email, phone, local, profile_picture) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *",
    [id, username, password, email, phone, local, profile_picture]
  );
  return res.rows[0];
};

const updatePetOwnerById = async (id, updatedPetOwnerData) => {
  const { username, password, email, phone, profile_picture } =
    updatedPetOwnerData;
  const res = await pool.query(
    "UPDATE Pet_owners SET username = $2, password = $3, email = $4, phone = $5, profile_picture = $6 WHERE id = $1 RETURNING *",
    [id, username, password, email, phone, profile_picture]
  );
  return res.rows[0];
};

const RegisterPetOnPetOwner = async (id, petId) => {
  const res = await pool.query(
    "UPDATE Pet_owners SET pets = array_append(pets, $2) WHERE id = $1 RETURNING *",
    [id, petId]
  );
  return res.rows[0];
};

const findPetOwnerByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM Pet_owners WHERE email = $1", [
    email,
  ]);
  return res.rows[0];
};

module.exports = {
  createPetOwner,
  updatePetOwnerById,
  findPetOwnerByEmail,
  selectPetOwnerById,
  RegisterPetOnPetOwner,
};
