const express = require("express");
const { loginPetOwner } = require("../controllers/authController");
const {
  registerPetOwner,
  updatePetOwner,
  getAllPetsPetOwner,
} = require("../controllers/petOwnerController");
const upload = require("../config/multer");
const { authToken } = require("../middlewares/authToken");

const router = express.Router();

router.get("/allPetOwnerPets/:petOwnerId", authToken, getAllPetsPetOwner);

router.post("/register", upload.single("profile_picture"), registerPetOwner);
router.post("/login", loginPetOwner);

router.put(
  "/update",
  [authToken, upload.single("profile_picture")],
  updatePetOwner
);

module.exports = router;
