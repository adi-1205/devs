const express = require('express');
const router = express.Router();
const controller = require('./index.controller');
const userValidator = require('../../middlewares/validators/user.validator');
const updateUserValidator = require('../../middlewares/validators/updateUser.validator');

router.get('/', controller.getAdmin);
router.put('/', controller.updateAdmin);


router.get('/recruiter/:id', controller.getRecruiterById);
router.get('/recruiter', controller.getRecruiters);
router.post('/recruiter', userValidator, controller.createRecruiter);
router.put('/recruiter/:id', updateUserValidator, controller.updateRecruiter);
router.delete('/recruiter/:id', controller.deleteRecruiter);

router.get('/client/:id', controller.getClientById);
router.get('/client', controller.getClients);
router.post('/client', userValidator, controller.createClient);
router.put('/client/:id', updateUserValidator, controller.updateClient);
router.delete('/client/:id', controller.deleteClient);


module.exports = router;