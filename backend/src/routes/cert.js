const express = require('express');
const router = express.Router();
const { getCert } = require('../controllers/certController');

/**
 * @swagger
 * /cert/{userID}:
 *   get:
 *     summary: Retrieve a user's certificate
 *     tags: [Cert]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to get the certificate for
 *     responses:
 *       200:
 *         description: Certificate successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: string
 *                 certificate:
 *                   type: string
 *       404:
 *         description: Certificate not found
 */
router.get('/cert/:userID', getCert);

module.exports = router;
