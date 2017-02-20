var cardController = function (Card) {

    var post = function (req, res) {
        var card = new Card(req.body);

        if (!req.body.name || !req.body.description || !req.body.cost) {
            res.status(400);
            res.send('Name, Description and Cost are required');
        } else {
            card.save();
            res.status(201);
            res.send(card);
        }
    };

    var get = function (req, res) {
        if (!req.accepts('application/json')) {
            res.status(406).send('Not an acceptable format');
        } else {

            var collection = {};
            var query = {};

            var start;
            // If record is unavailable it shows all records. These are the filters allowed
            if (req.query.start) {
                start = parseInt(req.query.start);
            }

            var limit;
            if (req.query.limit) {
                limit = parseInt(req.query.limit);
            }

            Card.find(query, function (error, cards) {
                if (error) {
                    res.status(500).send(error);
                } else {

                    var collectionLink = 'http://' + req.headers.host + '/cards';
                    var returnCards = [];

                    //Card Items
                    cards.forEach(function (element, index, array) {
                        var newCard = element.toJSON();
                        newCard._links = {};
                        newCard._links.self = {};
                        newCard._links.self.href = 'http://' + req.headers.host + '/cards/' + newCard._id;
                        newCard._links.collection = {};
                        newCard._links.collection.href = collectionLink;
                        returnCards.push(newCard);
                    });


                    if ((start === undefined) && (limit === undefined)) {
                        start = 1;
                        limit = cards.length;
                    } else if (!(start === undefined) && (limit === undefined)) {
                        if (start == 0) {
                            start = 1;
                        }
                        limit = cards.length;
                    } else if ((start === undefined) && !(limit === undefined)) {
                        start = 1;
                    } else {
                        if (start == 0) {
                            start = 1;
                        }
                    }

                    start--;

                    collection.items = returnCards.slice(start, start + limit);
                    var links = collection._links = {};
                    collection._links = {};
                    collection._links.self = {};
                    collection._links.self.href = 'http://' + req.headers.host + '/cards/';

                    collection.pagination = getPagination(cards.length, start + 1, limit, req, res);

                    res.json(collection);
                }
            });
        }
    };

    return {
        post: post,
        get: get
    };

};

var getPagination = function (total, start, limit, req, res) {
    var firstPage = 1;

    var lastPage = totalPages(total, start, limit);

    var prevPage = 0;
    if (currentPage(total, start, limit) == 1) {
        prevPage = 1;
    } else {
        prevPage = currentPage(total, start, limit) - 1;
    }

    var nextPage = 0;
    if (currentPage(total, start, limit) == lastPage) {
        nextPage = lastPage;
    } else {
        nextPage = currentPage(total, start, limit) + 1;
    }

    return {
        "currentItems": currentItems(total, start, limit),
        "currentPage": currentPage(total, start, limit),
        "totalPages": totalPages(total, start, limit),
        "totalItems": total,
        "_links": {
            "first": {
                "page": firstPage,
                "href": "http://" + req.headers.host + "/cards/" + getFirstQueryString(total, start, limit)
            },
            "last": {
                "page": lastPage,
                "href": "http://" + req.headers.host + "/cards/" + getLastQueryString(total, start, limit)
            },
            "previous": {
                "page": prevPage,
                "href": "http://" + req.headers.host + "/cards/" + getPrevQueryString(total, start, limit)
            },
            "next": {
                "page": nextPage,
                "href": "http://" + req.headers.host + "/cards/" + getNextQueryString(total, start, limit)
            }

        }
    }
};

var currentItems = function (total, start, limit) {
    if (limit > (total - start)) {
        return (total - (start - 1));
    }
    if (limit >= total) {
        return total;
    } else {
        return limit;
    }
};

var currentPage = function (total, start, limit) {
    return Math.ceil(start / limit);
};

var totalPages = function (total, start, limit) {
    return Math.ceil(total / limit);
};

var getFirstQueryString = function (total, start, limit) {
    return "?start=1&limit=" + limit;
};

var getLastQueryString = function (total, start, limit) {
    if (total % limit == 0) {
        return "?start=" + (total - limit + 1) + "&limit=" + limit;
    } else {
        return "?start=" + (total - (total % limit) + 1) + "&limit=" + limit;
    }
};

var getPrevQueryString = function (total, start, limit) {

    if (start - limit <= 0) {
        return getFirstQueryString(total, start, limit);
    } else {
        return "?start=" + (start - limit) + "&limit=" + limit;
    }
};

var getNextQueryString = function (total, start, limit) {
    if (total < start + limit) {
        return getLastQueryString(total, start, limit);
    } else {
        return "?start=" + (start + limit) + "&limit=" + limit;
    }
};

module.exports = cardController;