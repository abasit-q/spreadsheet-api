var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    jwt = require('jsonwebtoken'),
    config = require('../config');

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
    .post(function(req, res, next){
            mongoose.model('Users').findOne({ username: req.body.username }, function (err, user) {
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
                else if(!user) {
                    res.status(404);
                    res.format({
                        json: function(){
                            res.json({
                                success: false,
                                message: 'Username does not exist.'
                            });
                        }
                    });
                }
                else if(user) {
                    if (req.body.password === user.password) {
                        // Success
                        // Add user role and entity check here. Otherwise anyone can access any entity.
                        const payload = {
                            id: user.id
                        };
                        var token = jwt.sign(payload, config.jwt, {
                            expiresIn: 60*60*24*30*12 // 12 months
                        });
                        res.cookie('access_token', token, { maxAge: 3600000 * 24 * 30 * 12, httpOnly: true });
                        res.status(200);
                        res.format({
                            json: function () {
                                res.json({
                                    success: true,
                                    message: 'User logged in.',
                                    token: token
                                });
                            }
                        });
                    }
                    else {
                        res.status(401);
                        res.format({
                            json: function () {
                                res.json({
                                    success: false,
                                    message: 'Wrong password.'
                                })
                            }
                        });
                    }
                }
            });
    });

router.route('/init')
    .get(function(req, res, next){
        var User = mongoose.model('Users');
        var UserData = {
            username: 'admin',
            password: 'admin'
        };
        User.create(UserData, function(err, user){
            if (!err) {
                res.json('Good to go!');
            }
        });
    });

module.exports = router;