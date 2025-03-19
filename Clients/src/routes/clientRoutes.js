import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: The clients managing API
 *
 * /api/clients/:
 *   get:
 *     summary: Get all clients
 *     tags:
 *       - Clients
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/', getClients);

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: The clients managing API
 *
 * /api/clients/create:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: nombre
 *               lastname:
 *                 type: string
 *                 example: apelido1
 *               secondLastname:
 *                 type: string
 *                 example: apellido2
 *               email:
 *                 type: string
 *                 example: correo@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *     responses:
 *       201:
 *         description: Client successfully created
 */
router.post('/create', createClient);

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: The clients managing API
 *
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - secondLastname
 *               - email
 *               - phone
 *               - birthdate
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: NombreNuevo
 *               lastname:
 *                 type: string
 *                 example: ApellidoNuevo
 *               secondLastname:
 *                 type: string
 *                 example: Apellido2Nuevo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nuevocorreo@example.com
 *               phone:
 *                 type: string
 *                 example: "6183123232"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-21"
 *               address:
 *                 type: string
 *                 example: "132 Main St, City, Country"
 *     responses:
 *       200:
 *         description: Client successfully updated
 */
router.put('/:id', updateClient);

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: The clients managing API
 *
 * /api/clients/delete/{id}:
 *   patch:
 *     summary: Desactivate a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client to deactivate
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Client successfully deactivated
 */
router.patch('/delete/:id', deleteClient);


export default router;

