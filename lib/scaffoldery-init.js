var program = require('commander'),
  _ = require('lodash'),
  os = require('os'),
  fs = require('fs'),
  log = require('./util/log'),
  prompt = require('./util/prompt'),
  prompts = [],
  args = {};

// Help
program
  .option('-n, --name [name]')
  .option('-p, --platform [platform]')
  .parse(process.argv);

if (!program.name) {
  prompts.push({
    'message': 'What do you want to call it?',
    'name': 'name',
    'type': 'input'
  });
} else {
  args.name = program.name;
}

if (!program.platform) {
  prompts.push({
    'message': 'What is your target platform?',
    'name': 'platform',
    'type': 'input'
  });
} else {
  args.platform = program.platform;
}

prompt(prompts)
  .then(function (answers) {
    _.extend(args, answers);
    return args;
  })
  .then(function (options) {
    fs.writeFileSync('scaffoldery.json', JSON.stringify(options, null, '  ') + os.EOL);
  })
  .catch(function (err) {
    log.error(err.toString());
  });
