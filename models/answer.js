var mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
    Answer1: {
        type: String,
        required: true
    },
    UserName : {
        type: String,
        required: true
    },
    UserEmail : {
        type: String,
        required: true
    },
    WizardDatumId : {
        type: String,
        required: true
    }
} , { timestamps: true });

module.exports = mongoose.model('answer', answerSchema);
