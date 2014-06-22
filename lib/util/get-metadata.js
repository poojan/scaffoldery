var path = require('path'),
  fs = require('fs'),
  scan = require('./scan'),
  _ = require('lodash'),
  scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');

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