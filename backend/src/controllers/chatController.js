const { createChat, getChatByIds } = require('../models/Chat');

exports.initiateChat = async (req, res) => {
  try {
    const { userId, petOwnerId, petId } = req.body;

    // Verifica se o chat já existe
    let chat = await getChatByIds(userId, petOwnerId, petId);
    if (!chat) {
      chat = await createChat(userId, petOwnerId, petId);
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
