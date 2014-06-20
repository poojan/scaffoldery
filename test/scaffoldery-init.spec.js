'use strict';
/* global require, ok, __dirname, describe, it */

var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var should = require('should');
var bin = __dirname + '/../bin/scaffoldery';

describe('scaffoldery init', function () {
  it('should generate scaffoldery.json', function (done) {
    exec('cd test/tmp && ' + bin + ' init --name foo --platform javascript', function (err, stdout) {
      if (err) return done(err);

      fs.existsSync('test/tmp/scaffoldery.json').should.be.ok;
      fs.readFile('test/tmp/scaffoldery.json', function (err, data) {
        if (err) throw err;
        data.toString().should.containEql('name');
        data.toString().should.containEql('foo');
        data.toString().should.containEql('platform');
        data.toString().should.containEql('javascript');
      });
      done();
    });
  });
});
