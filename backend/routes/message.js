const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/message', sendMessage);
router.get('/message/:to', getMessages);

module.exports = router;
