const express = require('express');
const { addPet, registerPet } = require('../controllers/petController');
const { authToken } = require('../middlewares/authToken');
const router = express.Router();

router.post('/add', authToken, registerPet);

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Endpoints relacionados aos pets
 */

/**
 * @swagger
 * /api/pets/add:
 *   post:
 *     summary: Adiciona um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - description
 *               - race
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               description:
 *                 type: string
 *               race:
 *                 type: string
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Pet adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 race:
 *                   type: string
 *       400:
 *         description: Erro ao adicionar pet
 */

module.exports = router;
