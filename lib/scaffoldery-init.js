var inquirer = require('inquirer');
var program = require('commander');
var Q = require('q');
var _ = require('lodash');
var os = require('os');
var fs = require('fs');

// Help
program
  .option('-n, --name [name]')
  .option('-p, --platform [platform]')
  .parse(process.argv);

var prompts = [];
var args = {};

if (! program.name) {
  prompts.push({
    'message': 'What do you want to call it?',
    'name': 'name',
    'type': 'input'
  });
} else {
  args.name = program.name;
}

if (! program.platform) {
  prompts.push({
    'message': 'What is your target platform?',
    'name': 'platform',
    'type': 'input'
  });
} else {
  args.platform = program.platform;
}

var inquirerPrompt = function (opts) {
  var deferred = Q.defer();
  inquirer.prompt(opts, deferred.resolve);
  return deferred.promise;
};

inquirerPrompt(prompts).then(function (answers) {
  _.extend(args, answers);
  return args;
}).then(function (options) {
  fs.writeFileSync('scaffoldery.json', JSON.stringify(options, null, '  ') + os.EOL);
}).catch(function (err) {
  console.log(err.toString());
});
