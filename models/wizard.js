
var mongoose = require('mongoose');

var wizardSchema = new mongoose.Schema({
    titel: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    hashnum: {
        type: Number,
        required: true
    }
    
} , { timestamps: true });

module.exports = mongoose.model('wizard', wizardSchema);
