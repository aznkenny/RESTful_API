/**
 * Created by Kenny on 17/11/2016.
 */

// Requires
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db;

if(process.env.ENV == 'Test')
    db = mongoose.connect('mongodb://localhost/cardAPI_test');
else {
    db = mongoose.connect('mongodb://localhost/cardAPI');
}

var Card = require('./models/cardModel');
var app = express();

//Port
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Router
cardRouter = require('./Routes/cardRoutes')(Card);
app.use('/cards', cardRouter);


//MainHandler
app.get('/',function(req,res){
    res.send('Welcome to my Card API');
});

app.listen(port, function () {
    console.log('Gulp is running on PORT:' + port);
});

module.exports = app;