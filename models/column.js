var mongoose = require('mongoose'),
    config = require('../config'),
    connection = mongoose.connection.openUri(config.db),
    Schema = mongoose.Schema;

var columnSchema = new Schema({
    'title': String,
    'type': {
        type: String,
        default: 'text'
    },
    'options': [],
    "dateCreated": {
        type: Date,
        default: Date.now()
    },
    "dateModified": {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Columns', columnSchema);