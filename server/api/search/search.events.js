/**
 * Search model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Search = require('../../sqldb').Search;
var SearchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SearchEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Search.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    SearchEvents.emit(event + ':' + doc._id, doc);
    SearchEvents.emit(event, doc);
    done(null);
  }
}

module.exports = SearchEvents;
