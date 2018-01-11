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

router.route('/update').put(function (req, res, next) {
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
            var cells = sheet.rows.id(req.body.rowId).cells;
            var cell = cells.find(function (cell) {
                return cell.columnId == req.body.data.columnId;
            });
            if (cell !== undefined){
                cell.value = req.body.data.value;
            }
            else {
                sheet.rows.id(req.body.rowId).cells.push(req.body.data);
            }
            sheet.save(function (err) {
                if (err) {
                    res.status(500);
                    res.format({
                        json: function () {
                            res.json({
                                success: false,
                                message: 'Error updating cell.'
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
                                message: 'Cell updated successfully.',
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