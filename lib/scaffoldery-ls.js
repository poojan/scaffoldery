'use strict';

var program = require('commander');
var chalk = require('chalk');

var _ = require('lodash');

var getMetadata = require('./util/metadata').getMetadata;

program
  .usage('[platform] [generator]');

program.parse(process.argv);

var platform = program.args[0];

function listGenerators(metadata)
{

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
}

getMetadata().then(function (metadata) {
  listGenerators(metadata);
});
