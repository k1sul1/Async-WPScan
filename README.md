Asynchronous-WPScan
===================
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple NodeJS wrapper for WPScan. Takes a file (containing urls, separated with newlines) and uses WPScan on them.

Included PHP script filters out unnecessary data. Also emails the output to provided address.

Usage
=====


    npm install
    node server.js /path/to/file.txt

Notes
-----

Script assumes that wpscan is installed in /usr/bin/wpscan, change that if needed.

Very special thanks to [@pakastin](https://github.com/pakastin), couldn't have done this without his help.
