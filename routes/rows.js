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
            sheet.rows.push({
                title: 'Row ' + (sheet.rows.length + 1),
                cells: [],
                cellValuesByColumnIds: {}
            });
            sheet.save(function (err) {
                if (err) {
                    res.status(500);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Error adding new row.'
                            })
                        }
                    })
                }
                else {
                    var data = sheet.rows[sheet.rows.length-1].toJSON();
                    data.cellValuesByColumnIds = {};
                    res.status(200);
                    res.format({
                        json: function () {
                            res.json({
                                success: true,
                                message: 'Row added successfully.',
                                data: data
                            })
                        }
                    })
                }
            })
        }
    })
});

router.route('/update').put(function (req, res, next) {
    console.log(req.body);
    mongoose.model('SpreadSheets').findOneAndUpdate(
        {'_id' : req.body.sheetId, 'rows._id': req.body.data._id},
        {'$set': { 'rows.$' : req.body.data }},
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
                            message: 'Row updated successfully.'
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
            sheet.rows.id(req.body._id).remove();
            sheet.save(function (err) {
                if (err) {
                    res.status(500);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Error deleting row.'
                            })
                        }
                    })
                }
                else {
                    res.status(200);
                    res.format({
                        json: function () {
                            res.json({
                                success: true,
                                message: 'Row deleted successfully.',
                                data: mapCellValues(sheet.rows)
                            })
                        }
                    })
                }
            })
        }
    })
});

function mapCellValues(rows) {
    const data = [];
    rows.forEach(function (row) {
        const cellValuesByColumnIds = {};
        row.cells.forEach(function (cell) {
            cellValuesByColumnIds[cell.columnId] = cell.value;
        });
        var rowData = row.toJSON();
        rowData.cellValuesByColumnIds = cellValuesByColumnIds;
        data.push(rowData);
    });
    return data;
}

module.exports = router;