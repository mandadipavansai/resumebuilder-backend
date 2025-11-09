

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    templateName: {
        type: String,
        required: true,
        default: 'modern'
    },
    resumeData: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
