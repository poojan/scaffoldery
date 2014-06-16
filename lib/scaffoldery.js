var program = require('commander');

program
  //.version(require('../package').version)
  .version('0.0.1')
  .usage('<command> [options]');

program.on('--help', function () {
  console.log('  Commands:');
  console.log();
  console.log('    init                   initialize a new scaffold');
  console.log('    create                 create a new generator on the initialized scaffold');
  console.log('    install [name ...]     install a scaffold');
  console.log('    ls                     list installed scaffolds');
  console.log('    preview                preview template contents of a scaffold');
  console.log('    generate               generates a scaffold');
  console.log();
  process.exit();
});

program.parse(process.argv);

var spawn = require('win-fork');
var path = require('path');
var fs = require('fs');
var join = path.join;
var stat = fs.statSync;
var exists = fs.existsSync;
var resolve = path.resolve;

var args = process.argv.slice(3);

var cmd = program.args[0];

if (!cmd) program.help();

var bin = '../bin/scaffoldery-' + cmd;

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
