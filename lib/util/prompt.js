var inquirer = require('inquirer'),
  Q = require('q');

module.exports = function (opts) {
  var deferred = Q.defer();
  inquirer.prompt(opts, deferred.resolve);
  return deferred.promise;
};