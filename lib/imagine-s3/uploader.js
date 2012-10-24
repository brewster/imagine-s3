"use strict";

var events = require('events');
var extend = require('obj-extend');
var winston = require('winston');

var Uploader = function (client, key) {
  this.client = client;
  this.key = key;
};

Uploader.prototype = extend({}, events.EventEmitter.prototype, {

  handleResponse: function (response) {
    this.response = response;
    this.request = this.client.put(this.key, {
      'Content-Type': this.response.headers['content-type'],
      'Content-Length': this.response.headers['content-length']
    });

    // Set binds/timeout on request object
    this.request.setTimeout(5000, this.onTimeout.bind(this));
    this.request.on('response', this.onResponse.bind(this));
    this.request.on('error', this.onError.bind(this));

    // Setup and emit proxy emitter
    this.proxy = new events.EventEmitter();
    this.proxy.headers = this.response.headers;
    this.emit('response', this.proxy);

    // Emit response data to request and proxy
    this.emitData();
  },

  handleAbort: function () {
    // Abort request and remove all response listeners
    if (this.response) {
      this.request.abort();
      this.response.removeAllListeners();
    }
    delete this.client;
  },

  onError: function (error) {
    this.emit('error', { message: 'error uploading to s3' });
    winston.error('error uploading to s3', error);
    this.request.removeAllListeners();
  },

  onTimeout: function () {
    this.emit('error', { message: 'timeout uploading to s3' });
    winston.error('timeout uploading to s3');
    this.request.removeAllListeners();
  },

  onResponse: function (response) {
    if (response.statusCode === 200) {
      this.proxy.emit('end');
    } else {
      this.emit('error', {
        statusCode: response.statusCode,
        message: 'error uploading to s3'
      });
      winston.error('error uploading to s3', {
        code: response.statusCode
      });
    }
    this.request.removeAllListeners();
  },

  emitData: function () {
    // Emit data/end events to request and proxy
    var that = this;
    this.response.on('data', function (chunk) {
      that.request.write(chunk);
      winston.debug('uploaded bytes to s3', { n: chunk.length });
      that.proxy.emit('data', chunk);
    });
    this.response.on('end', function () {
      that.request.end();
      winston.debug('finished uploading to s3');
    });
  }

});

module.exports = Uploader;
