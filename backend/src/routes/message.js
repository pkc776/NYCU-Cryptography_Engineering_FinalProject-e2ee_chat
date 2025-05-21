const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
/**
 * @swagger
 * /message:
 *   post:
 *     summary: Send an encrypted message to another user
 *     tags: [Message]
 *     description: Accepts a base64-encoded encrypted message and forwards it to the target user (if online), or queues it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - content
 *             properties:
 *               from:
 *                 type: string
 *                 description: Sender user ID
 *               to:
 *                 type: string
 *                 description: Receiver user ID
 *               content:
 *                 type: string
 *                 description: Encrypted message (base64)
 *     responses:
 *       201:
 *         description: Message successfully sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 */
router.post('/message', sendMessage);
/**
 * @swagger
 * /message/{to}:
 *   get:
 *     summary: Retrieve all encrypted messages for a user
 *     tags: [Message]
 *     description: Returns all messages that were sent to the specified user.
 *     parameters:
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Receiver user ID
 *     responses:
 *       200:
 *         description: Array of encrypted messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   content:
 *                     type: string
 *                   timestamp:
 *                     type: integer
 *                     format: int64
 */

router.get('/message/:to', getMessages);


module.exports = router;