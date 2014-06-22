var _ = require('lodash'),
  program = require('commander'),
  path = require('path'),
  fs = require('fs'),
  os = require('os'),
  prompt = require('./util/prompt'),
  chalk = require('chalk'),
  homeDir = require('home-dir').directory,
  getMetadata = require('.util/get-metadata');

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

program.parse(process.argv);

var args = process.argv.slice(3);

var cmd = program.args[0];

var platform = program.args[0];
var generator = program.args[1];

var scaffoldTemplatesDir = path.join(__dirname, '..', 'scaffold_templates');

getMetadata()
  .then(function (metadata) {

    // If missing arguments, show help.
    if (!platform || !generator) {

      // Simulate help
      console.log();
      console.log('  Usage: scaffoldery-generate [platform] [generator]');
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
              if (!datum.package) {
                datum.package = '';
              }

              //var promptsFile = path.join(__dirname, '..', 'scaffold_templates', datum.package, g.promptsFile);
              var promptsFile = path.join(homeDir, '.scaffoldery', datum.package.replace('/', '-'), g.promptsFile);
              prompts = require(promptsFile);
            }

            // - If prompts are provided
            if (g.prompts) {
              prompts = g.prompts;
            }

            // Handle prompts
            if (prompts) {
              prompt(prompts)
                .then(function (answers) {

                  // Templates
                  var templates = [];
                  var templatesDir = '';

                  // - If templatesDirectory is provided
                  if (g.templatesDirectory) {
                    //var templatesDirectoryPath = path.join(__dirname, '..', 'scaffold_templates', datum.package, g.templatesDirectory);
                    var templatesDirectoryPath = path.join(homeDir, '.scaffoldery', datum.package.replace('/', '-'), g.templatesDirectory);
                    templates = fs.readdirSync(templatesDirectoryPath);
                    templatesDir = g.templatesDirectory;
                  }

                  // - If template is provided
                  if (g.template) {
                    templates = [g.template];
                  }

                  console.log();
                  console.log();
                  console.log('  Generated: ');
                  console.log();

                  // Loop within templates
                  _.each(templates, function (template) {

                    // TODO: Ignore non-text files
                    if (_.contains(template, '.swp'))
                      return;

                    // TODO: <%= %> in Gruntfile generates error
                    if (_.contains(template, 'Gruntfile'))
                      return;

                    //var templatePath = path.join(__dirname, '..', 'scaffold_templates', datum.package, templatesDir, template);
                    var templatePath = path.join(homeDir, '.scaffoldery', datum.package.replace('/', '-'), templatesDir, template);

                    var templateData = fs.readFileSync(templatePath, 'utf8');

                    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
                    var templateOutput = _.template(templateData, answers);

                    _.templateSettings.interpolate = /__([\s\S]+?)__/g;
                    var templateName = _.template(template, answers);

                    console.log('    ' + templateName);

                    fs.writeFileSync(templateName, templateOutput + os.EOL);

                  });
                  console.log();
                });
            }
          }
        });
      });
    }
  });
