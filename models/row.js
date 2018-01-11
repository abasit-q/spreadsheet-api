var mongoose = require('mongoose'),
    config = require('../config'),
    connection = mongoose.connection.openUri(config.db),
    Schema = mongoose.Schema,
    cellSchema = require('./cell');

var rowSchema = new Schema({
    'title': String,
    'cells': [
        cellSchema.schema
    ],
    'cellValuesByColumnIds': {},
    "dateCreated": {
        type: Date,
        default: Date.now()
    },
    "dateModified": {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Rows', rowSchema);