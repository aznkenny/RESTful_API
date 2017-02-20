var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Card = mongoose.model('Card'),
    agent = request.agent(app);

describe('Card CRUD test', function(){
    it('Should allow a Card to be posted and return a name and _id',function(done){
        var cardPost = {name: "Card Name", description: "Some information"};

        agent.post('/cards')
            .send(cardPost)
            .expect(200)
            .end(function(error, results){
                results.body.should.have.property('_id');
                done();
            })
    });
    afterEach(function(done){
        Card.remove().exec();
        done();
    })
});