var express = require('express');
var router = express.Router();
var stateModel = require('../models/states')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/states', function (req, res) {
    var query = {};
    var select = { state: 1, _id: 0 };
    if (req.query.hasOwnProperty('search') && req.query.search) {
        query = { state: new RegExp(req.query.search, 'i') };
    }
    stateModel.find(query, function (err, results) {
        if (err) {
            res.send({ success: false, error: "Error fetching states" });
        } else {
            if (results.length <= 0) {
                res.send({ success: true, data: results, message: 'No States found. Please check the state name' });
            } else {
                res.send({ success: true, data: results });
            }
        }
    })
})

router.get('/cities', function (req, res) {
    var query = {};
    var select = { cities: 1, _id: 0, state: 1 };
    if (req.query.hasOwnProperty('search') && req.query.search) {
        query = { cities: new RegExp(req.query.search, 'i') };
        select = { state: 1, 'cities.$': 1, _id: 0 };
    }
    stateModel.find(query, select, function (err, results) {
        if (err) {
            res.send({ success: false, error: "Error fetching states" });
        } else {
            if (results.length <= 0) {
                res.send({ success: true, data: results, message: 'No Cities found. Please check the state name' });
            } else {
                res.send({ success: true, data: results });
            }
        }
    })
})

router.get('/seed', function (req, res) {
    jsonfile.readFile(filiePath).then(function (data) {
        var states = {};
        var dataArray = [];
        for (var i = 0; i <= data.length - 1; i++) {
            if (data[i].state) {
                if (!states.hasOwnProperty(data[i].state)) {
                    states[data[i].state] = data.filter(obj => {
                        return obj.state === data[i].state
                    }).map((obj) => {
                        return obj.name;
                    })
                    var stateModelSchema = new stateModel({ state: data[i].state, cities: states[data[i].state] });
                    var error = stateModelSchema.validateSync();
                    if (!error) {
                        stateModelSchema.save();
                        dataArray.push(stateModelSchema);
                    }
                }
            }
        }
        res.send({ success: true, data: dataArray });
    });

})

module.exports = router;