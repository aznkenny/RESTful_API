var express = require('express');

var routes = function(Card){
    var cardRouter = express.Router();
    var cardController = require('../controllers/cardController')(Card);

    cardRouter.route('/')
        .post(cardController.post)
        .get(cardController.get)
        .options(function(req, res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.status(200).send();
        });

    cardRouter.use('/:cardId', function (req,res,next) {
        Card.findById(req.params.cardId, function (error, card){
            if (error) {
                res.status(500).send(error);
            } else if (card){
                req.card = card;
                next();
            } else {
                res.status(404).send('No card found');
            }
        });
    });

    cardRouter.route('/:cardId')
        .get(function(req,res) {

            var returnCard = req.card.toJSON();

            returnCard._links = {};
            returnCard._links.self = {};
            returnCard._links.self.href = 'http://' + req.headers.host + '/cards/' + returnCard._id;
            returnCard._links.collection = {};
            returnCard._links.collection.href = 'http://' + req.headers.host + '/cards/';
            res.json(returnCard);
            
        })
        .put(function(req,res){

            if(!req.body.name || !req.body.description ||  !req.body.cost){
                res.status(400);
                res.send('This is required');
            }
            else{
                req.card.name = req.body.name;
                req.card.cost = req.body.cost;
                req.card.element = req.body.element;
                req.card.type = req.body.type;
                req.card.job = req.body.job;
                req.card.category = req.body.category;
                req.card.power = req.body.power;
                req.card.description = req.body.description;
                req.card.cardnumber = req.body.cardnumber;

                req.card.save(function (error) {
                    if (error)
                        res.status(500).send(error);
                    else {
                        res.json(req.card);
                    }
                });
            }
        })
        .patch(function(req,res) {
            if (req.body._id) {
                delete req.body._id;
            }

            for(var p  in req.body)
            {
                req.card[p] = req.body[p];
            }

            req.card.save(function (error){
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(req.card);
                }
            });
        })
        .delete(function(req,res){
            req.card.remove(function(error){
                if(error){
                    res.status(500).send(error);
                } else {
                    res.status(204).send('Card removed');
                }
            });
        })
        .options(function(req, res) {
            res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, OPTIONS');
            res.status(200).send();
        });

    return cardRouter;
};

module.exports = routes;