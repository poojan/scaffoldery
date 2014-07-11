'use strict';

var exec = require('child_process').exec,
  fs = require('fs'),
  should = require('should'),
  bin = __dirname + '/../bin/scaffoldery',
  reset = require('./utils').reset;

describe('scaffoldery', function () {

  describe('init', function () {

    beforeEach(function (done) {
      reset(done);
    });

    it('should generate scaffoldery.json', function (done) {
      exec('cd test/tmp && ' + bin + ' init --name foobar --platform javascript', function (err) {
        if (err) { return done(err); }

        fs.readFile('test/tmp/scaffoldery.json', function (err, data) {
          if (err) { throw err; }
          data = data.toString();
          data.should.containEql('name');
          data.should.containEql('foobar');
          data.should.containEql('platform');
          data.should.containEql('javascript');
          done();
        });
      });
    });
  });
});
