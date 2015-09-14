'use strict';

var app = require('../..');
var request = require('supertest');

var newMessage;

describe('Message API:', function() {

  describe('GET /api/makeVideo', function() {
    var messages;

    beforeEach(function(done) {
      request(app)
        .get('/api/makeVideo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          messages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      messages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/makeVideo', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/makeVideo')
        .send({
          name: 'New Message',
          info: 'This is the brand new message!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newMessage = res.body;
          done();
        });
    });

    it('should respond with the newly created message', function() {
      newMessage.name.should.equal('New Message');
      newMessage.info.should.equal('This is the brand new message!!!');
    });

  });

  describe('GET /api/makeVideo/:id', function() {
    var message;

    beforeEach(function(done) {
      request(app)
        .get('/api/makeVideo/' + newMessage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          message = res.body;
          done();
        });
    });

    afterEach(function() {
      message = {};
    });

    it('should respond with the requested message', function() {
      message.name.should.equal('New Message');
      message.info.should.equal('This is the brand new message!!!');
    });

  });

  describe('PUT /api/makeVideo/:id', function() {
    var updatedMessage

    beforeEach(function(done) {
      request(app)
        .put('/api/makeVideo/' + newMessage._id)
        .send({
          name: 'Updated Message',
          info: 'This is the updated message!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMessage = {};
    });

    it('should respond with the updated message', function() {
      updatedMessage.name.should.equal('Updated Message');
      updatedMessage.info.should.equal('This is the updated message!!!');
    });

  });

  describe('DELETE /api/makeVideo/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/makeVideo/' + newMessage._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when message does not exist', function(done) {
      request(app)
        .delete('/api/makeVideo/' + newMessage._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
