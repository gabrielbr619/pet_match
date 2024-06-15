const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerSetup = require('./swagger');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const petOwnerRoutes = require('./routes/petOwnerRoutes');
const petRoutes = require('./routes/petRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const http = require('http');
const server = http.createServer(app);
const setupSocket = require('./socket'); // Importa o setup do socket

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: 'http://localhost:8081', // URL do seu frontend
  methods: ['GET', 'PUT', 'DELETE', 'POST'],
}));

app.use('/api/users', userRoutes);
app.use('/api/petowners', petOwnerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

swaggerSetup(app);

setupSocket(server); // Configura o socket.io

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
