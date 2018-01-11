var mongoose = require('mongoose'),
    config = require('../config'),
    connection = mongoose.connection.openUri(config.db),
    Schema = mongoose.Schema;

var cellSchema = new Schema({
    'columnId': {
        type: Schema.Types.ObjectId,
        ref: 'Columns'
    },
    'value': {
        type: String,
        default: 0
    },
    "dateCreated": {
        type: Date,
        default: Date.now()
    },
    "dateModified": {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Cells', cellSchema);