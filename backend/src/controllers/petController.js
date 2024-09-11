const pool = require("../config/db");
const { calculateDistance } = require("../helpers/calculateDistance");
const { uploadManyPictures } = require("../helpers/uploadPictures");
const {
  createPet,
  deletePet,
  getRandomPetForUser,
  markPetAsViewed,
  dislikePet,
  updatePet,
  findPets,
} = require("../models/Pet");
const { RegisterPetOnPetOwner } = require("../models/PetOwner");
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: process.env.GOOGLE_MAPS_API_KEY, // Substitua pela sua chave da API do Google Maps
};
const geocoder = NodeGeocoder(options);

exports.findPets = async (req, res) => {
  const {
    selectedSpecie,
    selectedGender,
    selectedBreed,
    location,
    currentLocation,
    userId,
  } = req.body;

  try {
    let userCoordinates;

    // Determinar as coordenadas do usuário
    if (currentLocation) {
      userCoordinates = currentLocation;
    } else if (location) {
      const geoData = await geocoder.geocode(location);
      userCoordinates = {
        latitude: geoData[0].latitude,
        longitude: geoData[0].longitude,
      };
    }

    // Buscar pets aplicando filtros
    const pets = await findPets({
      specie: selectedSpecie,
      gender: selectedGender,
      breed: selectedBreed,
      userId,
    });

    // Separar pets com coordenadas e sem coordenadas
    const petsWithCoordinates = [];
    const petsWithoutCoordinates = [];

    pets.forEach((pet) => {
      if (pet.coordinates && pet.coordinates.x && pet.coordinates.y) {
        const distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          pet.coordinates.x,
          pet.coordinates.y
        );
        return petsWithCoordinates.push({ ...pet, distance });
      }
      petsWithoutCoordinates.push(pet);
    });

    // Ordenar pets com coordenadas pela distância mais próxima
    petsWithCoordinates.sort((a, b) => a.distance - b.distance);

    // Combinar arrays: pets com coordenadas primeiro, seguidos pelos sem coordenadas
    const finalPetsList = [...petsWithCoordinates, ...petsWithoutCoordinates];

    res.status(200).json(finalPetsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar pets." });
  }
};

exports.registerPet = async (req, res) => {
  try {
    const { name, age, description, specie, breed, owner_id, gender } =
      req.body;

    let pictures = [];

    if (req.files) {
      pictures = await uploadManyPictures(req, "pet_pictures");
    }

    const pet = await createPet({
      name,
      age,
      description,
      specie,
      breed,
      pictures,
      owner_id,
      gender,
    });

    await RegisterPetOnPetOwner(owner_id, pet.id);

    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePetById = async (req, res) => {
  try {
    const { id, name, age, description, specie, breed, gender } = req.body;

    let pictures = [];

    if (req.files) {
      pictures = await uploadManyPictures(req, "pet_pictures");
    }

    const updatedPet = await updatePet({
      id,
      name,
      age,
      description,
      specie,
      breed,
      pictures: pictures.length > 0 ? pictures : req.body.existingPictures, // Se não houverem novas imagens, manter as existentes
      gender,
    });

    res.status(200).json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { pet_id } = req.body;
    const pet = await deletePet(pet_id);
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRandomPet = async (req, res) => {
  try {
    const { userId: user_id } = req.params;

    const lastViewedRes = await pool.query(
      "SELECT pet_id FROM user_viewed_pets WHERE user_id = $1 ORDER BY last_viewed DESC LIMIT 1",
      [user_id]
    );
    const last_pet_id =
      lastViewedRes.rows.length > 0
        ? lastViewedRes.rows[0].pet_id
        : "11111111-1111-1111-1111-111111111111";

    const pet = await getRandomPetForUser(user_id, last_pet_id);

    if (!pet) {
      return res.status(200).json({ message: "No more pets available" });
    }

    //await markPetAsViewed(user_id, pet.id);

    res.status(200).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message }, "getRandomPet");
  }
};

exports.userDislikePet = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { pet_id } = req.body;
    await dislikePet(user_id, pet_id);
    res.status(201).json({ message: "Pet disliked successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
