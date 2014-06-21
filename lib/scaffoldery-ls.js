var _ = require('lodash');
var program = require('commander');
var chalk = require('chalk');
var getMetadata = require('./util/get-metadata');

program
  .usage('[platform] [generator]');

program.parse(process.argv);

var args = process.argv.slice(3);

// command
var cmd = program.args[0];

var platform = program.args[0];
var generator = program.args[1];

getMetadata()
  .then(function (metadata) {

    // Simulate help
    console.log();
    console.log('  ' + chalk.cyan('Available generators:') + '');
    console.log();

    _.each(metadata, function (datum) {
      if (platform && datum.platform !== platform) {
        return;
      }
      console.log('    ' + datum.platform + ' (' + datum.package + ')');
      _.each(datum.generators, function (generator) {
        console.log('      ' + generator.name);
        console.log();
      });
    });
  });
