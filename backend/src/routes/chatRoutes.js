const express = require("express");
const {
  initiateChat,
  getUserChats,
  getPetOwnerChats,
} = require("../controllers/chatController");
const { authToken } = require("../middlewares/authToken");
const router = express.Router();

router.get("/getUserChats/:id", authToken, getUserChats);
router.get("/getPetOwnerChats/:id", authToken, getPetOwnerChats);

router.post("/", authToken, initiateChat);

module.exports = router;
