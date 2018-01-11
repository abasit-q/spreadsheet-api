var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));

router.route('/')
    .get(function (req, res, next) {
        mongoose.model('Users').find({}, function(err, users){
            if (err) {
                console.log('Error finding Users model.', err);
                res.status(500);
                res.format({
                    json: function () {
                        res.json({
                            success: false,
                            message: 'Error finding Users model.'
                        })
                    }
                })
            }
            else if (!users.length) {
                res.status(400);
                res.format({
                    json: function() {
                        res.json({
                            success: false,
                            message: 'No users found.'
                        });
                    }
                });
            }
            else {
                res.status(200);
                res.format({
                    json: function() {
                        res.json({
                            success: true,
                            data: users
                        });
                    }
                });
            }
        });
    })
    .post(function(req, res, next){
        mongoose.model('Users').create(req.body, function (err, user) {
            if (err) {
                console.log('Error finding Users model.', err);
                res.status(500);
                res.format({
                    json: function () {
                        res.json({
                            success: false,
                            message: 'Error finding Users model.'
                        })
                    }
                })
            }
            else {
                res.status(200);
                res.format({
                    json: function() {
                        res.json({
                            success: true,
                            message: 'User created successfully.',
                            id: user.id
                        });
                    }
                });
            }
        });
    })
    .delete(function(req, res, next){
        mongoose.model('Users').findById(req.params.id, function(err, user){
            if (err) {
                console.log('Error finding Users model.', err);
                res.status(500);
                res.format({
                    json: function () {
                        res.json({
                            success: false,
                            message: 'Error finding Users model.'
                        })
                    }
                })
            }
            else if (!user) {
                res.status(404);
                res.format({
                    json: function() {
                        res.json({
                            success: false,
                            message: 'Cannot find the requested user: ' + req.params.id
                        });
                    }
                });
            }
            else {
                user.remove(function(err, user){
                    if (err) {
                        console.log('Error removing user:', err);
                        res.status(500);
                        res.format({
                            json: function () {
                                res.json({
                                    success: false,
                                    message: 'Error removing user:' + req.params.id
                                })
                            }
                        })
                    }
                    else {
                        res.status(200);
                        res.format({
                            json: function() {
                                res.json({
                                    success: true,
                                    message: 'Requested user has been deleted: ' + req.params.id
                                });
                            }
                        });
                    }
                });
            }
        });
    })
    .put(function(req, res, next){
        mongoose.model('Users').findById(req.params.id, function(err, user){
            if (err) {
                console.log('Error finding users model:', err);
                res.status(500);
                res.format({
                    json: function () {
                        res.json({
                            success: false,
                            message: 'Error finding users model.'
                        })
                    }
                })
            }
            else if (!user) {
                res.status(404);
                res.format({
                    json: function() {
                        res.json({
                            success: false,
                            message: 'Cannot find the requested user: ' + req.params.id
                        });
                    }
                });
            }
            else {
                user.update(req.body, function(err, user){
                    if (err) {
                        console.log('Error updating user:' + err);
                        res.status(500);
                        res.format({
                            json: function () {
                                res.json({
                                    success: false,
                                    message: 'Error updating user.'
                                })
                            }
                        })
                    }
                    else {
                        res.status(200);
                        res.format({
                            json: function() {
                                res.json({
                                    success: true,
                                    message: 'Requested user has been updated: ' + req.params.id
                                });
                            }
                        });
                    }
                });
            }
        });
    });

module.exports = router;