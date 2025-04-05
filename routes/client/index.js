const express = require('express');
const router = express.Router();
const controller = require('./index.controller');

router.get('/jobs', controller.getJobs);
router.post('/job', controller.createJob);

module.exports = router;