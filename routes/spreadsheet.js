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
        mongoose.model('SpreadSheets').find({}, function (err, sheets) {
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
            else if (!sheets.length) {
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
                var sheet = sheets[0];
                res.status(200);
                res.format({
                    json: function() {
                        res.json({
                            success: true,
                            _id: sheet._id,
                            columnData: sheet.columns,
                            rowData: mapCellValues(sheet.rows)
                        });
                    }
                });
            }
        })
    })
    .post(function (req, res, next) {
        mongoose.model('SpreadSheets').create(req.body, function (err, sheet) {
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
            else {
                res.status(200);
                res.format({
                    json: function () {
                        res.json({
                            success: true,
                            message: 'SpreadSheet created successfully.'
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