var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    config = require('../../config');

router.use(function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwt, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'Access token missing.'
        });
    }
});

module.exports = router;