var program = require('commander'),
  inquirer = require('inquirer'),
  Q = require('q'),
  _ = require('lodash'),
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  log = require('./util/log'),
  prompt = require('./util/prompt'),
  name,
  prompts = [],
  args = {};

program.parse(process.argv);

if (!fs.existsSync('scaffoldery.json')) {
  log.error('scaffoldery.json does not exist. please run `scaffoldery init` first.');
  return;
}

if (!program.args.length) {
  prompts.push({
    'message': 'What do you want to call it?',
    'name': 'name',
    'type': 'input'
  });
} else {
  name = program.args[0];
  args.name = name;
}

prompt(prompts)
  .then(function (answers) {
    name = answers.name;
    _.extend(args, answers);
    return args;
  })
  .then(function (options) {

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
      log.error('template already exists');
      return;
    }

    scaffolderyJson.generators.push(generatorJson);

    var scaffolderyJsonString = JSON.stringify(scaffolderyJson, null, '  ');

    fs.writeFileSync('scaffoldery.json', scaffolderyJsonString + os.EOL);

    fs.createReadStream(path.join(__dirname, 'templates', '_prompts.js'))
      .pipe(fs.createWriteStream(options.name + '-prompts.js'));

    if (!fs.existsSync(options.name + '-templates')) {
      fs.mkdirSync(options.name + '-templates');
    }

    fs.createReadStream(path.join(__dirname, 'templates', '_sample.js'))
      .pipe(fs.createWriteStream(path.join(options.name + '-templates', 'sample.js')));

  }).catch(function (err) {
    console.log(err);
  });

