var chalk = require('chalk');

exports.error = function (message) {
  console.log();
  console.log(chalk.red('    error : ') + chalk.gray(message));
  console.log();
};
