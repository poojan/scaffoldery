'use strict';

var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var should = require('should');


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
