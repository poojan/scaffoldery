'use strict';
/* globals require, process, console */

var program = require('commander');

var inquirer = require('inquirer');
var Q = require('q');
var _ = require('lodash');

var fs = require('fs');
var os = require('os');

program.parse(process.argv);

if (!fs.existsSync('scaffoldery.json')) {
  console.log('Error: scaffoldery.json does not exist. Please run `scaffoldery init` first.');
  return;
}

var name;
var prompts = [];
var args = {};

if (! program.args.length) {
  prompts.push({
    'message': 'What do you want to call it?',
    'name': 'name',
    'type': 'input'
  });
} else {
  name = program.args[0];
  args.name = name;
}

var inquirerPrompt = function (opts) {
  var deferred = Q.defer();
  inquirer.prompt(opts, deferred.resolve);
  return deferred.promise;
};

inquirerPrompt(prompts).then(function (answers) {
  name = answers.name;
  _.extend(args, answers);
  return args;
}).then(function (options) {
  //console.log('options', options);
  var generatorJson = {
    "name": options.name,
    "templatesDirectory": options.name + "-templates",
    "promptsFile": options.name + "-prompts.js"
  };

  var scaffolderyData = fs.readFileSync('scaffoldery.json', 'utf8');
  var scaffolderyJson = JSON.parse(scaffolderyData);
  if (!scaffolderyJson.generators) {
    scaffolderyJson.generators = [];
  }

  if (_.findWhere(scaffolderyJson.generators, { name: options.name })) {
    console.log();
    console.log('  Error: Template already exists');
    console.log();
    return;
  }
  scaffolderyJson.generators.push(generatorJson);

  var scaffolderyJsonString = JSON.stringify(scaffolderyJson, null, '  ');

  fs.writeFileSync('scaffoldery.json', scaffolderyJsonString + os.EOL);
}).catch(function (err) {
  console.log(err);
});

