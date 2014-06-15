var _ = require('lodash');
var program = require('commander');
var path = require('path');
var fs = require('fs');
var os = require('os');
var inquirer = require('inquirer');
var chalk = require('chalk');
var homeDir = require('home-dir').directory;

var scan = require('./util/scan');
var EventEmitter = require('events').EventEmitter,
    metadataEE = new EventEmitter(),
    metadata = [];

program
  .usage('[platform] [generator]');

program.parse(process.argv);

var args = process.argv.slice(3);

// command
var cmd = program.args[0];

var platform = program.args[0];
var generator = program.args[1];


// TODO: Refactor getMetadata()
//
// Collect metadata within scaffold_templates directory
function getMetadata() {
  //var scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');
  var scaffoldTemplatesDir = path.join(homeDir, '.scaffoldery');

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

    metadataEE.emit('metadata_ready');
  });
}

getMetadata();

// If done collective metadata from the files
metadataEE.on('metadata_ready', function () {

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

    if (!metadataFiltered) return;
    if (!gen) return;

    var templatesDir = gen.templatesDirectory;
    if (!templatesDir) templatesDir = '';

    // TODO: Only preview files inside templatesDirectory for now
    var templatesPath = path.join(homeDir, '.scaffoldery', metadatum.package.replace('/', '-'), templatesDir);
    //var templatesPath = path.join(homeDir, '.scaffoldery', metadatum.package.replace('/', '-'));

    // curses {
    require('./util/preview')(templatesPath);
    // curses }
  }
});