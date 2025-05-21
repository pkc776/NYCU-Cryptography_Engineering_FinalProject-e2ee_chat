const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/userController');
const { getUser } = require('../storage/users');
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
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: alice
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: alice
 *       400:
 *         description: Missing username in request
 *       404:
 *         description: User not found
 */
router.post('/login', login);

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
