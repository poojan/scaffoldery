var program = require('commander');

// usage

program
  //.version(require('../package').version)
  .version('0.0.1')
  .usage('<command> [options]')

program.on('--help', function () {
  console.log('  Commands:');
  console.log();
  console.log('    init                   initialize a new scaffold');
  console.log('    install [name ...]     install a scaffold');
  console.log('    generate               generates a scaffold');
  console.log('    create                 create a new scaffold');
  console.log('    ls                     list installed scaffolds');
  console.log();
  process.exit();
});

// parse argv
program.parse(process.argv);

var spawn = require('win-fork');
var path = require('path');
var fs = require('fs');
var join = path.join;
var stat = fs.statSync;
var exists = fs.existsSync;
var resolve = path.resolve;

// args void of cmd

var args = process.argv.slice(3);

// command

var cmd = program.args[0];

// display help
if (!cmd) program.help();

// executable

var bin = '../bin/scaffoldery-' + cmd;

// local or resolve to absolute executable path

var local = join(__dirname, bin);

if (exists(local)) {
  bin = local;
} else {
  bin = process.env.PATH.split(':').reduce(function (binary, p) {
    p = resolve(p, bin);
    return exists(p) && state(p).isFile() ? p : binary;
  }, bin);
}

// display help if bin does not exist
if (!exists(bin)) {
  console.log('\n  %s(1) does not exist', bin);
  program.help();
}

// spawn

var proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });

proc.on('close', function (code) {
  process.exit(code);
});

/*var path = require('path');*/
/*var fs = require('fs');*/
/*var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');*/
/*var scaffolder = require(lib + '/scaffolder.js').run();*/
