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
 *               - specie
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               description:
 *                 type: string
 *               specie:
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
 *                 specie:
 *                   type: string
 *       400:
 *         description: Erro ao adicionar pet
 */

/**
 * @swagger
 * /api/pets/remove:
 *   delete:
 *     summary: Remove um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet removido com sucesso
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
 *                 specie:
 *                   type: string
 *       400:
 *         description: Erro ao remover pet
 */
