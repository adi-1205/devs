const express = require('express');
const router = express.Router();
const controller = require('./index.controller');

router.get('/', controller.getRecruiter);
router.put('/', controller.updateRecruiter);

router.get('/jobs', controller.getJobs);
router.post('/jobs/note', controller.addNote);


module.exports = router;