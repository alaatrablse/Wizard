var mongoose = require('mongoose');
const wizard = require('./wizard');

var pageSchema = new mongoose.Schema({
    wizardType: {
        type: String,
        required: true
    },
    numPages : {
        type: String,
        required: true
    },
    wizardid : {
        type: String,
        required: true
    }
} , { timestamps: true });

module.exports = mongoose.model('page', pageSchema);
