const {
  createChat,
  getChatByIds,
  getUserChats,
  getPetOwnerChats,
} = require("../models/Chat");
const { selectPetOwnerById } = require("../models/PetOwner");
const { selectPetById } = require("../models/Pet");
const { getMessageById } = require("../models/Message");
const { findUserById } = require("../models/User");

exports.initiateChat = async (req, res) => {
  try {
    const { userId, petOwnerId, petId } = req.body;

    // Verifica se o chat já existe
    const chat = await getChatByIds(userId, petOwnerId, petId);
    if (!chat) {
      chat = await createChat(userId, petOwnerId, petId);
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    const chatsArray = [];

    // Verifica se o chat já existe
    const chats = await getUserChats(user_id);

    if (chats.length === 0) {
      return res.status(200).json("No Chat found");
    }

    // Itera sobre cada chat
    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];

      const user = await findUserById(chat.user_id);
      const pet_owner = await selectPetOwnerById(chat.pet_owner_id);
      const pet = await selectPetById(chat.pet_id);

      console.log(chat);
      const last_message = await getMessageById(chat.last_message_sent);
      console.log(last_message);
      chatsArray.push({
        chat_id: chat.id,
        created_at: chat.created_at,
        pet_owner,
        pet,
        user,
        last_message: last_message ? last_message : null,
      });
    }

    return res.status(200).json(chatsArray);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPetOwnerChats = async (req, res) => {
  try {
    const { id: petOwnerId } = req.params;

    const chatsArray = [];

    // Verifica se o chat já existe
    const chats = await getPetOwnerChats(petOwnerId);

    if (chats.length === 0) {
      return res.status(200).json("No Chat found");
    }

    // Itera sobre cada chat
    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];

      const user = await findUserById(chat.user_id);
      const petOwner = await selectPetOwnerById(chat.pet_owner_id);
      const pet = await selectPetById(chat.pet_id);

      const last_message = await getMessageById(chat.last_message_sent);

      chatsArray.push({
        chat_id: chat.id,
        created_at: chat.created_at,
        user,
        pet,
        last_message: last_message ? last_message : null,
        petOwner,
      });
    }

    return res.status(200).json(chatsArray);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
