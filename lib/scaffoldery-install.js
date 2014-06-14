var request = require('request');
var fs = require('fs');
var path = require('path');
var homeDir = require('home-dir').directory;
var AdmZip = require('adm-zip');
var program = require('commander');

program.parse(process.argv);

var package = program.args[0];

var user = package.split('/')[0];
var repo = package.split('/')[1];

var scaffolderyPath = path.join(homeDir, '.scaffoldery');

var oldScaffoldDirName = repo + '-master';
var newScaffoldDirName = package.replace('/', '-');

var tmpPath = path.join(scaffolderyPath, 'tmp');

var zipUrl = 'https://nodeload.github.com/' + package + '/zip/master';
var zipFile = path.join(scaffolderyPath, oldScaffoldDirName + '.zip');

request.get(zipUrl).pipe(fs.createWriteStream(zipFile)).on('close', function () {
  var zip = new AdmZip(zipFile);
  var zipEntries = zip.getEntries();
  zip.extractAllTo(scaffolderyPath);
  fs.unlinkSync(zipFile);
});