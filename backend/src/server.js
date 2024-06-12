const express = require('express');
const bodyParser = require('body-parser');
const swaggerSetup = require('./swagger');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const petOwnerRoutes = require('./routes/petOwnerRoutes');
const petRoutes = require('./routes/petRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/petowners', petOwnerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
