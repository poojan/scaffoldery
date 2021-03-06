'use strict';

var Q = require('q');
var path = require('path');
var homeDir = require('home-dir').directory;
var _ = require('lodash');
var fs = require('fs');

var metadata = [];

var scan = require('./scan');

// Collect metadata within scaffold_templates directory
function getMetadata() {
  //var scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');
  var scaffoldTemplatesDir = path.join(homeDir, '.scaffoldery');

  var deferred = Q.defer();

  scan(scaffoldTemplatesDir, 'scaffoldery.json', function (err, files) {
    _.each(files, function (file) {
      var data = fs.readFileSync(file, 'utf8');
      var json = JSON.parse(data);
      metadata.push(json);
    });
    var sorted = _.sortBy(metadata, function (datum) {
      return datum.platform;
    });
    metadata = sorted;

    deferred.resolve(metadata);
  });

  return deferred.promise;
}

exports.getMetadata = getMetadata;
