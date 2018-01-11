var mongoose = require('mongoose'),
    config = require('../config'),
    connection = mongoose.connection.openUri(config.db),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Users', userSchema);