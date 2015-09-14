/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/searchs              ->  index
 * POST    /api/searchs              ->  create
 * GET     /api/searchs/:id          ->  show
 * PUT     /api/searchs/:id          ->  update
 * DELETE  /api/searchs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Search = sqldb.Search;
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');


function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

function responseWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

// Gets a list of Searchs
exports.index = function(req, res) {
    console.log(req.body);
    youTube.search(req.body.search, 10, function(error, result) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(result);
            res.send(JSON.stringify(result, null, 10));
        }
    });
};

// Gets a single Search from the DB
exports.show = function(req, res) {
  Search.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};


