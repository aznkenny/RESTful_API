var should = require('should'),
    sinon = require('sinon');

describe('Card Controller Tests:', function(){
    describe('Post', function(){
        it('should not allow an empty name on post',function(){
            var Card = function(card){this.save = function(){}};

            var req = {
                body: {
                    description: 'Default description'
                }
            };

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            };

            var cardController = require('../Controllers/cardController')(Card);
            cardController.post(req,res);

            res.status.calledWith(400).should.equal(true,'Bad Status' + res.status.args[0]);
            res.send.calledWith('Name is required').should.equal(true);

        });
    });
});