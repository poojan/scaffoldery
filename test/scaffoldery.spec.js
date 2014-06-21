'use strict';

var exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  should = require('should');

describe('scaffoldery', function () {
  it('should output help', function (done) {
    exec('bin/scaffoldery', function (err, stdout) {
      if (err) return done(err);
      stdout.should.containEql('scaffoldery <command> [options]');
      stdout.should.containEql('--help');
      stdout.should.containEql('init');
      stdout.should.containEql('ls');
      stdout.should.containEql('generate');
      stdout.should.containEql('create');
      stdout.should.containEql('install');
      done();
    });
  });
});
