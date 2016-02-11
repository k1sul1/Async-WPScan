var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var async = require('async');
var request = require('request');
var nodemailer = require('nodemailer');
var nl2br  = require('nl2br');

var date = new Date();

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
    'cd /usr/bin/wpscan;',
    'echo ' + url + ';',
    './wpscan.rb --url=' + url + ' --batch |',
    'php ' + path.join(__dirname, 'wp_check_for_vulnerabilities.php') + ';',
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

  var transporter = nodemailer.createTransport('direct:?name=server.example.com');

  var mailOptions = {
    from: 'Server <server@example.com>',
    to: 'flow+wpscan@viivis.flowdock.com',
    subject: 'WPSCAN Tulokset ' + padZero(date.getDate()) + padZero(date.getMonth() + 1) + padZero(date.getFullYear()),
    text: results, // plaintext body
    html: nl2br(results) // html body
  };

  transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
      return;
    }
    console.log('Message sent: ' + info.response);
  });
}
function padZero (num) {
  return ('0' + num).slice(-2);
}
