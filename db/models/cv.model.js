const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    exp: [{
        lang_type: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        laguages: [{
            laguage: {
                type: String,
                required: true,
                minlength: 1,
                trim: true
            },
            frameworks: [String]
        }],
        description: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        }
    }],
    qualifications: [{
        degree_name: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        degree_type: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        institution: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        graduated: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        grade: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        info: {
            type: String,
            minlength: 1,
            trim: true
        },
    }],
    links: [{
        site: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        link: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        }
    }]
});

const Cv = mongoose.model('cv', CvSchema);
module.exports = { Cv };