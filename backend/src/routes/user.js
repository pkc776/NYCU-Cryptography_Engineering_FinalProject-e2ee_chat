const express = require('express');
const router = express.Router();
const { register, getUsers } = require('../controllers/userController');
 
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user with username and publicKey
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               publicKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Missing fields
 */
router.post('/register', register);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all registered users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   publicKey:
 *                     type: string
 */
router.get('/users', getUsers);



module.exports = router;


