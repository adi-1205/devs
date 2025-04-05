const express = require('express');
const router = express.Router();
const controller = require('./index.controller');
const userValidator = require('../../middlewares/validators/user.validator');

router.post('/register', userValidator, controller.register);
router.post('/login', controller.login);

module.exports = router;