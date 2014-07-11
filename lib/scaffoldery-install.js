'use strict';

var request = require('request');
var fs = require('fs');
var os = require('os');
var path = require('path');
var homeDir = require('home-dir').directory;
var AdmZip = require('adm-zip');
var program = require('commander');
var log = require('./util/log');

program
  .usage('[package]');

program.parse(process.argv);

var pkg = program.args[0];

if (!pkg) {
  log.error('package needed');
  return;
}

//var user = pkg.split('/')[0];
var repo = pkg.split('/')[1];

var scaffolderyPath = path.join(homeDir, '.scaffoldery');

var oldScaffoldDirName = repo + '-master';
var newScaffoldDirName = pkg.replace('/', '-');

//var tmpPath = path.join(scaffolderyPath, 'tmp');

var zipUrl = 'https://nodeload.github.com/' + pkg + '/zip/master';
var zipFile = path.join(scaffolderyPath, oldScaffoldDirName + '.zip');

request.get(zipUrl).pipe(fs.createWriteStream(zipFile)).on('close', function () {
  var zip = new AdmZip(zipFile);
  //var zipEntries = zip.getEntries();
  //zip.extractAllTo(scaffolderyPath);
  zip.extractEntryTo(oldScaffoldDirName + '/',
    path.join(scaffolderyPath, newScaffoldDirName),
    false, true);
  fs.unlinkSync(zipFile);

  // Auto-update package in scaffoldery.json
  var scaffolderyJsonPath = path.join(scaffolderyPath, newScaffoldDirName, 'scaffoldery.json');
  var scaffolderyData = fs.readFileSync(scaffolderyJsonPath, 'utf8');
  var scaffolderyJson = JSON.parse(scaffolderyData);

  if (!scaffolderyJson.package) {
    scaffolderyJson.package = pkg;
  }

  var scaffolderyJsonString = JSON.stringify(scaffolderyJson, null, '  ');

  fs.writeFileSync(scaffolderyJsonPath, scaffolderyJsonString + os.EOL);

});

// Delete zip downloads none existent repos
var undefinedMaster = path.join(scaffolderyPath, 'undefined-master.zip');
fs.exists(undefinedMaster, function (exists) {
  if (exists) { fs.unlinkSync(undefinedMaster); }
});
