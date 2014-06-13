var _ = require('lodash');
var program = require('commander');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');

var scan = require('./scan');
var EventEmitter = require('events').EventEmitter,
    metadataEE = new EventEmitter(),
    metadata = [];

// Help
program
  .usage('[platform] [generator]');

program.on('--help', function () {
  console.log('  Examples:');
  console.log();
  console.log('    # generate angular directive');
  console.log('    $ scaffoldery generate angular directive');
  console.log();
  process.exit();
});

// parse argv
program.parse(process.argv);
// args void of cmd

var args = process.argv.slice(3);

// command
var cmd = program.args[0];

var platform = program.args[0];
var generator = program.args[1];


// Collect metadata within scaffold_templates directory
function getMetadata() {
  var scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');

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
    console.log('  Usage: scaffoldery-generate [platform] [generator]');
    console.log();
    console.log('  Available generators:');
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

  // Output generated scaffold to console
  if (platform && generator) {
    var platformData = _.where(metadata, { platform: platform });
    _.each(platformData, function (datum) {
      _.each(datum.generators, function (g) {

        if (g.name === generator) {

          // Prompts
          var prompts = [];

          // - If promptsFile is provided
          if (g.promptsFile) {
            var promptsFile = path.join(__dirname, '..', 'scaffold_templates', datum.package, g.promptsFile);
            prompts = require(promptsFile);
          }

          // - If prompts are provided
          if (g.prompts) {
            prompts = g.prompts;
          }

          // Handle prompts
          if (prompts) {
            inquirer.prompt(prompts, function (answers) {

              // Templates
              var templates = [];
              var templatesDir = '';

              // - If templatesDirectory is provided
              if (g.templatesDirectory) {
                var templatesDirectoryPath = path.join(__dirname, '..', 'scaffold_templates', datum.package, g.templatesDirectory);
                templates = fs.readdirSync(templatesDirectoryPath);
                templatesDir = g.templatesDirectory;
              }

              // - If template is provided
              if (g.template) {
                templates = [g.template];
              }


              // Loop within templates
              _.each(templates, function (template) {
                if (_.contains(template, '.swp'))
                  return;
                if (_.contains(template, 'Gruntfile'))
                  return;

                var templatePath = path.join(__dirname, '..', 'scaffold_templates', datum.package, templatesDir, template);
                var templateData = fs.readFileSync(templatePath, 'utf8');

                _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
                var templateOutput = _.template(templateData, answers);

                console.log(template);
                console.log(templateOutput);

              });
            });
          }
        }
      });
    });
  }
});
