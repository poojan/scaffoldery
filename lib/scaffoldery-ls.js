'use strict';

var _ = require('lodash');
var program = require('commander');
var chalk = require('chalk');
var getMetadata = require('./util/get-metadata');

program
  .usage('[platform] [generator]');

program.parse(process.argv);

var platform = program.args[0];
var generator = program.args[1];

getMetadata().then(function (metadata) {
  // Simulate help
  console.log();
  console.log('  ' + chalk.cyan('Available generators:') + '');
  console.log();

  _.each(metadata, function (datum) {
    if (platform && datum.platform !== platform) {
      return;
    }

    _.each(datum.generators, function (gen) {
      if (generator) {
        if (generator === gen.name) {
          console.log('    ' + datum.platform + ' (' + datum.package + ')');
          console.log('      ' + gen.name);
          console.log();
        }
      } else {
        console.log('    ' + datum.platform + ' (' + datum.package + ')');
        console.log('      ' + gen.name);
        console.log();
      }
    });

  });
});
