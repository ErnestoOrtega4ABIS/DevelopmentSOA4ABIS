import express from "express";
import { createUsers, getUsers, updateUsers, deleteUser, login, NewPassword, PasswordToken } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /api/users/:
 *  get:
 *   summary: Get all users
 *   tags: [Users]
 *   responses: 
 *     '200':
 *       description: A successful response
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/users/create:
 *  post:
 *   summary: Create a new user
 *   tags: [Users]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               example: "1234567890"
 *             username:
 *               type: string
 *               example: "usuario@example.com"
 *             password:
 *               type: string
 *               example: "mypassword123"
 *   responses: 
 *     '201':
 *       description: User created successfully
 */
router.post('/create', createUsers);

/**
 * @swagger
 * /api/users/{id}:
 *  patch:
 *   summary: Update a user's information
 *   tags: [Users]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The user ID
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               example: "0987654321"
 *             password:
 *               type: string
 *               example: "newpassword123"
 *   responses: 
 *     '200':
 *       description: User updated successfully
 */
router.patch('/:id', updateUsers);

/**
 * @swagger
 * /api/users/delete/{id}:
 *  delete:
 *   summary: Soft delete a user (deactivate)
 *   tags: [Users]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The user ID
 *   responses: 
 *     '200':
 *       description: User successfully deactivated
 */
router.delete('/delete/:id', deleteUser);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *   summary: Authenticate user and return a token
 *   tags: [Users]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "usuario@example.com"
 *             password:
 *               type: string
 *               example: "mypassword123"
 *   responses: 
 *     '200':
 *       description: User authenticated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Usuario autenticado"
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     '401':
 *       description: Usuario y/o contraseña incorrectos
 *     '500':
 *       description: Error al autenticar usuario
 */
router.post('/login', login);

router.post('/pass', PasswordToken);

router.put('/newpass/:token', NewPassword);

export default router;
