'use strict';

var fs = require('fs');
var async = require('async');
var Q = require('q');

var scan = function (dir, suffix) {
  var deferred = Q.defer();

  fs.readdir(dir, function (err, files) {

    if (!files) {
      //No files found
      deferred.resolve([]);
    }
    else {

      var returnFiles = [];

      async.each(files, function (file, next) {
        var filePath = dir + '/' + file;
        fs.stat(filePath, function (err, stat) {
          if (err) {
            return next(err);
          }
          if (stat.isDirectory()) {
            scan(filePath, suffix)
              .then(function (results) {
                returnFiles = returnFiles.concat(results);
                next();
              })
              .catch(function () {
                return next(err);
              });
          }
          else if (stat.isFile()) {
            if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
              returnFiles.push(filePath);
            }
            next();
          }
        });
      }, function (err) {
        if (err) {
          deferred.reject(err);
        }
        else {
          deferred.resolve(returnFiles);
        }
      });
    }
  });

  return deferred.promise;

};

module.exports = scan;
