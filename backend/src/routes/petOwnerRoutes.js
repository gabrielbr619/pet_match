const express = require('express');
const { loginPetOwner } = require('../controllers/authController');
const { registerPetOwner } = require('../controllers/petOwnerController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PetOwner
 *   description: API for pet owner
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new pet owner
 *     tags: [PetOwner]
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
 *               - local
 *               - profile_picture
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
 *               profile_picture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet owner registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 local:
 *                   type: string
 *                 profile_picture:
 *                   type: string
 *       400:
 *         description: Bad request
 */
router.post('/register', registerPetOwner);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a pet owner
 *     tags: [PetOwner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Bad request
 */

router.post('/login', loginPetOwner);

module.exports = router;
