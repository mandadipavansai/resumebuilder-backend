const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authmiddleware');

// This is the controller with the correct function names
const {
    improveWriting,
    getAtsScore,
    personalizeForJob
} = require('../controllers/ai-controller.js');




router.post('/improve', protect, improveWriting);


router.post('/atsscore', protect, getAtsScore);


router.post('/personalize', protect, personalizeForJob);

module.exports = router;
