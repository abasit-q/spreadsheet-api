var mongoose = require('mongoose'),
    config = require('../config'),
    connection = mongoose.connection.openUri(config.db),
    Schema = mongoose.Schema,
    columnSchema = require('./column'),
    rowSchema = require('./row');

var sheetSchema = new Schema({
    'title': {
        type: String,
        default: 'Untitled'
    },
    'columns': [
        columnSchema.schema
    ],
    'rows': [
        rowSchema.schema
    ],
    "dateCreated": {
        type: Date,
        default: Date.now()
    },
    "dateModified": {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('SpreadSheets', sheetSchema);