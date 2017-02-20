var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var cardModel = new Schema({
    name: { type: String },
    cost: { type: String },
    element: { type: String },
    type: { type: String },
    job: { type: String },
    category: { type: String },
    power: { type: String },
    description: { type: String },
    cardnumber: { type: String }
});

module.exports = mongoose.model('Card', cardModel);