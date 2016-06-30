#!/usr/bin/env node

require('dotenv').config(); // load dotenv
var wpscandir = process.env.WPSCAN_INSTALL_DIR || '/usr/bin/wpscan';

var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var async = require('async');
var request = require('request');

fs.readFile(process.argv[2], 'utf8', onFile); // takes "third" argument which should be file

function onFile (err, data) {
  if (err) {
    console.error(err);
    return;
  }

  var urls = data.split('\n');
  scanSites(urls);
}

function scanSites (urls) {
  var filteredUrls = urls.filter(function (url){return url;});

  async.map(filteredUrls, onUrl, onResults);
}

function onUrl (url, next) {
  var cmd = [
    'echo ' + url + ';',
    wpscandir + '/wpscan.rb --url=' + url + ' --batch;',
    'echo ---------\n'
  ];

  cp.exec(cmd.join(' '), function (err, stdout, stderr) {
    if (err) {
      next(err);
      return;
    }
    if (stderr) {
      next(stderr);
      return;
    }
    if (stdout) {
      next(null, stdout);
    }
  });
}

function onResults (err, results) {
  if (err) {
    console.error(err);
    return;
  }
  results = results.join('\n');
  process.stdout.write(results);
}

