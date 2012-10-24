"use strict";

var knox = require('knox');
var Uploader = require('./imagine-s3/uploader');
var Downloader = require('./imagine-s3/downloader');

var ImagineS3 = function (config) {
  this.client = knox.createClient(config);
};

ImagineS3.prototype =  {

  ready: function () {
    return !!this.client;
  },

  uploader: function (key) {
    return new Uploader(this.client, key);
  },

  downloader: function (key) {
    return new Downloader(this.client, key);
  }

};

module.exports = ImagineS3;
