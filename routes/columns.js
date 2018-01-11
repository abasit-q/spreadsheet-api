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

router.route('/add').post(function (req, res, next) {
    mongoose.model('SpreadSheets').findById(req.body.sheetId, function (err, sheet) {
        if (err) {
            console.log('Error finding SpreadSheet model.', err);
            res.status(500);
            res.format({
                json: function () {
                    res.json({
                        success: false,
                        message: 'Error finding SpreadSheet model.'
                    })
                }
            })
        }
        else if (!sheet) {
            res.status(404);
            res.format({
                json: function() {
                    res.json({
                        success: false,
                        message: 'No SpreadSheet found.'
                    });
                }
            });
        }
        else {
            sheet.columns.push({
                title: 'Column ' + (sheet.columns.length + 1),
                type: 'text'
            });
            sheet.save(function (err) {
                if (err) {
                    res.status(500);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Error adding new column.'
                            })
                        }
                    })
                }
                else {
                    res.status(200);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Column added successfully.',
                                data: sheet.columns[sheet.columns.length-1]
                            })
                        }
                    })
                }
            })
        }
    })
});

router.route('/update').put(function (req, res, next) {
    mongoose.model('SpreadSheets').findOneAndUpdate(
        {'_id' : req.body.sheetId, 'columns._id': req.body.data._id},
        {'$set': { 'columns.$' : req.body.data }},
        {new: true},
        function (err, sheet) {
        if (err) {
            console.log('Error finding SpreadSheet model.', err);
            res.status(500);
            res.format({
                json: function () {
                    res.json({
                        success: false,
                        message: 'Error finding SpreadSheet model.'
                    })
                }
            })
        }
        else if (!sheet) {
            res.status(404);
            res.format({
                json: function() {
                    res.json({
                        success: false,
                        message: 'No SpreadSheet found.'
                    });
                }
            });
        }
        else {
            res.status(200);
            res.format({
                json: function() {
                    res.json({
                        success: false,
                        message: 'Column updated successfully.',
                        data: sheet.columns
                    });
                }
            });
        }
    })
});

router.route('/delete').delete(function (req, res, next) {
    mongoose.model('SpreadSheets').findById(req.body.sheetId, function (err, sheet) {
        if (err) {
            console.log('Error finding SpreadSheet model.', err);
            res.status(500);
            res.format({
                json: function () {
                    res.json({
                        success: false,
                        message: 'Error finding SpreadSheet model.'
                    })
                }
            })
        }
        else if (!sheet) {
            res.status(404);
            res.format({
                json: function() {
                    res.json({
                        success: false,
                        message: 'No SpreadSheet found.'
                    });
                }
            });
        }
        else {
            sheet.columns.id(req.body._id).remove();
            sheet.save(function (err) {
                if (err) {
                    res.status(500);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Error deleting column.'
                            })
                        }
                    })
                }
                else {
                    res.status(200);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Column deleted successfully.',
                                data: sheet.columns
                            })
                        }
                    })
                }
            })
        }
    })
});

module.exports = router;