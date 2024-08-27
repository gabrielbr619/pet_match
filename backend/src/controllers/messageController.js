const { createMessage, getMessagesByChatId } = require("../models/Message");
const { uploadManyPictures } = require("../helpers/uploadPictures");

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    let imageUrls = [];

    if (req.files) {
      imageUrls = await uploadManyPictures(req);
    }

    const message = await createMessage(chatId, senderId, content, imageUrls);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessagesByChatId(chatId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
