


const Resume = require('../models/resumeModel.js');
const { generatePdf } = require('../utils/pdfTemplate.js');


const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching resumes.' });
    }
};


const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume && resume.user.toString() === req.user._id.toString()) {
            res.status(200).json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching resume.' });
    }
};


const createResume = async (req, res) => {
    try {
        const { templateName, resumeData } = req.body;
        const resume = new Resume({
            user: req.user._id,
            templateName,
            resumeData,
        });
        const createdResume = await resume.save();
        res.status(201).json(createdResume);
    } catch (error) {
        res.status(400).json({ message: 'Error creating resume.' });
    }
};


const updateResume = async (req, res) => {
    try {
        const { resumeData, templateName } = req.body;
        const resume = await Resume.findById(req.params.id);

        if (resume && resume.user.toString() === req.user._id.toString()) {
            resume.resumeData = resumeData || resume.resumeData;
            resume.templateName = templateName || resume.templateName;
            const updatedResume = await resume.save();
            res.status(200).json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating resume.' });
    }
};


const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume && resume.user.toString() === req.user._id.toString()) {
            await resume.deleteOne();
            res.status(200).json({ message: 'Resume removed' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting resume.' });
    }
};



const generatePdfPreview = async (req, res) => {
    try {
        const { resumeData, templateName } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: 'No resume data provided for preview.' });
        }
        const stream = await generatePdf(resumeData, templateName);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
    } catch (error) {
        console.error('PDF Preview Error:', error);
        res.status(500).json({ message: 'Error generating PDF preview.' });
    }
};
module.exports = {
    getMyResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    generatePdfPreview,
};
