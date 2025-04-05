const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { ROLE } = require('../config/constants');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', require('./auth'));
router.use('/admin', auth, authorize([ROLE.ADMIN]), require('./admin'));
router.use('/recruiter', auth, authorize([ROLE.RECRUITER]), require('./recruiter'));
router.use('/client', auth, authorize([ROLE.CLIENT]), require('./client'));

module.exports = router;
