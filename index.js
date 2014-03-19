'use strict';
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var through = require('through2').obj;
var toStream = require('stream-array');
function depth(string) {
  return path.normalize(string).split(path.sep).length - 1;
}
function dealWith(inPath, up) {
  if (!up) {
    return inPath;
  }
  if (depth(inPath) < up) {
    throw new Error('cant go up that far');
  }
  return path.join.apply(path, inPath.split(path.sep).slice(1));
}
module.exports = copyFiles;
function copyFiles(args, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = 0;
  }
  opts = opts || 0;
  if (typeof callback !== 'function') {
    throw new Error('callback is not optional');
  }
  var input = args.slice();
  var outDir = input.pop();
  toStream(input)
  .pipe(through(function (pathName, _, next) {
    var self = this;
    glob(pathName, function (err, paths) {
      if (err) {
        return next(err);
      }
      paths.forEach(function (unglobbedPath) {
        self.push(unglobbedPath);
      });
      next();
    });
  }))
  .pipe(through(function (pathName, _, next) {
    var outName = path.join(outDir, dealWith(pathName, opts));
    mkdirp(path.dirname(outName), function (err) {
      if (err) {
        return next(err);
      }
      fs.createReadStream(pathName)
        .pipe(fs.createWriteStream(outName))
        .on('error', next)
        .on('finish', function () {
          next(null, outName);
        });
    });
  }))
  .on('error', callback)
  .on('finish', function () {
    callback();
  });
}