var async = require('async');
var request = require('request');
var cp = require('child_process');
var fs = require('fs');
var nodemailer = require('nodemailer');
var nl2br  = require('nl2br');

var date = new Date();


readFile(process.argv[2], onFile); // takes "third" argument which should be file

function readFile (file, cb) {
  fs.readFile(file, 'utf8', cb);
}

function onFile (err, data) {
  if (err) return console.error(err);

  var urls = data.split('\n');
  scanSites(urls);
}

function scanSites (urls) {
  async.map(urls.filter(function (url){return url;}),onUrl,onResults);
}

function onUrl (url, next) {
  cp.exec('cd /usr/bin/wpscan; echo ' + url + '; ./wpscan.rb --url=' + url + ' --batch | php ' + __dirname + '/wp_check_for_vulnerabilities.php; echo ---------\n', function (err, stdout, stderr) {
    if(err){
      return next(err);
    }
    if(stderr){
      console.error(stderr);
      return next('STDERR');
    }
    if(stdout){
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
      to: 'you@example.com',
      subject: 'WPSCAN results ' + date.getDate() + (date.getMonth() + 1) + date.getFullYear(),
      text: results, // plaintext body
      html: nl2br(results) // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}