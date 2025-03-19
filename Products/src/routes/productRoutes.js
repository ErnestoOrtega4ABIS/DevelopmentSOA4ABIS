import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 * /api/products/:
 *  get:
 *   summary: Get all products
 *   tags: [Products]
 *   responses:
 *     '200':
 *       description: A successful response
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/create:
 *  post:
 *   summary: Create a new product
 *   tags: [Products]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             ProductName:
 *               type: string
 *               example: "Remote Control Car"
 *             UnitPrice:
 *               type: number
 *               example: 29.99
 *             Stock:
 *               type: integer
 *               example: 100
 *             CategoryID:
 *               type: integer
 *               example: 1
 *   responses: 
 *     '201':
 *       description: Product created successfully
 */
router.post('/create', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *   summary: Update an existing product
 *   tags: [Products]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the product to update
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             ProductName:
 *               type: string
 *               example: "Updated Remote Control Car"
 *             UnitPrice:
 *               type: number
 *               example: 39.99
 *             Stock:
 *               type: integer
 *               example: 150
 *             CategoryID:
 *               type: integer
 *               example: 2
 *   responses:
 *     '200':
 *       description: Product updated successfully
 */
router.patch('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *   summary: Deactivate a product (set status to false)
 *   tags: [Products]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the product to deactivate
 *   responses:
 *     '200':
 *       description: Product deactivated successfully
 */
router.delete('/:id', deleteProduct);

export default router;