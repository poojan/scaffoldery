var _ = require('lodash'),
  program = require('commander'),
  path = require('path'),
  fs = require('fs'),
  os = require('os'),
  prompt = require('./util/prompt'),
  chalk = require('chalk'),
  homeDir = require('home-dir').directory,
  getMetadata = require('.util/get-metadata'),
  gulp = require('gulp'),
  tmpl = require('gulp-template'),
  q = require('q'),
  rename = require('gulp-rename');

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

var filenameRegex = /__([\s\S]+?)__/;
var tplOpts = {
  'interpolate': /{{([\s\S]+?)}}/g,
  'evaluate': /{{([\s\S]+?)}}/g
};

function getFilename(origFilename, answers) {
  var key = origFilename.match(filenameRegex)[1];
  if (!answers[key]) {
    throw new Error('No value defined for ' + key);
  }
  return origFilename.replace(filenameRegex, answers[key]);
}

function scaffold(path, answers) {

  gulp.src(path)
    .pipe(tmpl(answers, tplOpts))
    .pipe(rename(function (dir, base, ext) {
      return (base.match(filenameRegex) ? getFilename(base, answers) : base) + ext;
    }))
    .pipe(gulp.dest(path.resolve(process.cwd())));

}

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

                  var templateDirectory = './template/**/*';

                  // - If templatesDirectory is provided
                  //if (g.templatesDirectory) {
                    //var templatesDirectoryPath = path.join(__dirname, '..', 'scaffold_templates', datum.package, g.templatesDirectory);
                    //var templatesDirectoryPath = path.join(homeDir, '.scaffoldery', datum.package.replace('/', '-'), g.templatesDirectory);
                  //}

                  // Loop within templates
                  scaffold(templateDirectory, answers);
                  console.log();
                });
            }
          }
        });
      });
    }
  });
