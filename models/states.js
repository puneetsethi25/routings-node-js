var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statesSchema = new Schema({
    state: {
        type: String,
        index: true,
        unique: true,
        dropDups: true
    },
    cities: [String]
})

var statesModel = mongoose.model('states', statesSchema);
module.exports = statesModel