/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/makeVideo              ->  index
 * POST    /api/makeVideo              ->  create
 * GET     /api/makeVideo/:id          ->  show
 * PUT     /api/makeVideo/:id          ->  update
 * DELETE  /api/makeVideo/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Message = sqldb.Message;
var fs = require('fs');
var ytdl = require('youtube-dl');
var path = require('path');


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

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Messages
exports.index = function(req, res) {
    /*
  Message.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
    */
    var video = ytdl('http://www.youtube.com/watch?v=kfchvCyHmsc',
        // Optional arguments passed to youtube-dl.
        ['-f', '18']);

    var size = 0;
    video.on('info', function(info) {
        size = info.size;
        console.log('Got video info');
        console.log('saving to ' + info._filename);
        var output = path.join('/Users/david.bailey/Projects/', 'test3', info._filename);
        video.pipe(fs.createWriteStream(output));
    });

    var pos = 0;
    video.on('data', function(data) {
        pos += data.length;
        // `size` should not be 0 here.
        if (size) {
            var percent = (pos / size * 100).toFixed(2);
            process.stdout.write(percent + '%');
        }
    });

    video.on('end', function() {
        console.log();
    });
};

// Gets a single Message from the DB
exports.show = function(req, res) {
  Message.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Message in the DB
exports.create = function(req, res) {
  Message.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Message in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Message.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Message from the DB
exports.destroy = function(req, res) {
  Message.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
