// routes/userRoutes.js
const express = require('express');
const { registerUser, userLikePet, getUser, userDeslikePet } = require('../controllers/userController');
const { authToken } = require('../middlewares/authToken');
const router = express.Router();

router.get('/getUser/:id',authToken, getUser);

router.post('/register', registerUser);

router.put('/likePet', authToken, userLikePet);
router.put('/deslikePet', authToken, userDeslikePet);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados aos usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               local:
 *                 type: string
 *               pictures:
 *                 type: string
 *                 format: text
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Erro ao registrar usuário
 */


module.exports = router;
