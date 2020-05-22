const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    markdown: {
        type: String,
        required: true,
        minlength: 1
    }
});

const Cv = mongoose.model('cvs', CvSchema);
module.exports = { Cv };
