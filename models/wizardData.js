var mongoose = require('mongoose');

var wizardDataSchema = new mongoose.Schema({
    wizardIndex: {
        type: String,
        required: true
    },
    pageId : {
        type: String,
        required: true
    }
    
} , { timestamps: true });

module.exports = mongoose.model('wizardData', wizardDataSchema);
