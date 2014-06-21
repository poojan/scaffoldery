var path = require('path');
var fs = require('fs');
var scan = require('./scan');
var _ = require('lodash');
var scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');

module.exports = function getMetadata() {
  return scan(scaffoldTemplatesDir, 'scaffoldery.json')
    .then(function (files) {
      return _.chain(files)
        .map(function (file) {
          var data = fs.readFileSync(file, 'utf8');
          return JSON.parse(data);
        })
        .sortBy('platform')
        .value();
    });
};