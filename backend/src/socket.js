const socketIo = require('socket.io');
const { createMessage } = require('./models/Message'); // Assumindo que você tem a função createMessage

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:8081", // URL do seu frontend
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('joinRoom', ({ userId, chatId }) => {
      socket.join(chatId);
      console.log(`${userId} joined room: ${chatId}`);
    });

    socket.on('message', async ({ chatId, senderId, content, imageUrls }) => {
      const message = { chatId, senderId, content, imageUrls, timestamp: new Date() };
      io.to(chatId).emit('message', message);
      console.log(`Message sent to room ${chatId}: ${content}`);

      try {
        // Save the message to the database
        await createMessage(chatId, senderId, content, imageUrls);
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    });
  });
};

module.exports = setupSocket;
