const express = require('express');
const router = express.Router();
const {
    getMyResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    generatePdfPreview,
} = require('../controllers/resumecontroller');
const { protect } = require('../middlewares/authmiddleware');

router.route('/').get(protect, getMyResumes).post(protect, createResume);

router
    .route('/:id')
    .get(protect, getResumeById)
    .put(protect, updateResume)
    .delete(protect, deleteResume);



router.post('/preview/:id', protect, generatePdfPreview);

module.exports = router;














