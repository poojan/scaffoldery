var rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  tmpDir = 'test/tmp';

module.exports = {
  reset: function reset(done) {
    rimraf(tmpDir, function () {
      mkdirp(tmpDir, function () {
        done();
      });
    });
  }
};