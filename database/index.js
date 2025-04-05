const mongoose = require('mongoose');
const CONFIG = require('../config/config');

mongoose.connect(CONFIG.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
