const express = require("express");
const {
  registerPet,
  deletePet,
  getRandomPet,
  userDislikePet,
  updatePetById,
} = require("../controllers/petController");
const { authToken } = require("../middlewares/authToken");
const upload = require("../config/multer");
const router = express.Router();

router.get("/randomPet/:userId", authToken, getRandomPet);

router.post("/add", authToken, upload.array("pictures", 5), registerPet);

router.put("/update", authToken, upload.array("pictures", 5), updatePetById);

router.put("/dislikePet", authToken, userDislikePet);

router.delete("/delete", authToken, deletePet);

module.exports = router;
