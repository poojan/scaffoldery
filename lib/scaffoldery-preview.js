'use strict';

var _ = require('lodash');
var program = require('commander');
var path = require('path');
var chalk = require('chalk');
var homeDir = require('home-dir').directory;

var getMetadata = require('./util/metadata').getMetadata;

program
  .usage('[platform] [generator]');

program.parse(process.argv);

var platform = program.args[0];
var generator = program.args[1];

getMetadata().then(function (metadata) {
  // If missing arguments, show help.
  if (!platform || !generator) {

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

  // If platform + generator combination exists, show a preview
  if (platform && generator) {
    var metadataFiltered = _.where(metadata, { platform: platform });
    var metadatum;

    var gen;
    _.each(metadataFiltered, function (metadatumFiltered) {
      if (!gen) {
        gen = _.findWhere(metadatumFiltered.generators, { name: generator });
        if (gen) {
          metadatum = metadatumFiltered;
          return;
        }
      }
    });

    if (!metadataFiltered) { return; }
    if (!gen) { return; }

    var templatesDir = gen.templatesDirectory;
    if (!templatesDir) { templatesDir = ''; }

    // TODO: Only preview files inside templatesDirectory for now
    var templatesPath = path.join(homeDir, '.scaffoldery', metadatum.package.replace('/', '-'), templatesDir);
    //var templatesPath = path.join(homeDir, '.scaffoldery', metadatum.package.replace('/', '-'));

    // curses {
    require('./util/preview')(templatesPath);
    // curses }
  }
});
