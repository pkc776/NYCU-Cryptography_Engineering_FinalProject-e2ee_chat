const express = require('express');
const router = express.Router();
const { register, getUsers } = require('../controllers/userController');

router.post('/register', register);
router.get('/users', getUsers);

module.exports = router;
