'use strict';
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var stream = require('readable-stream');
var inherits = require('util').inherits;
var noms = require('noms').obj;
var once = require('once');
var debug = require('debug');
var debugArgs = debug('copyfiles:args');
var debugOpts = debug('copyfiles:opts');

function toStream(array) {
  var length = array.length;
  var i = 0;
  return noms(function (done) {
    if (i >= length) {
      this.push(null);
    }
    this.push(array[i++]);
    done();
  });
}
function depth(string) {
  return path.normalize(string).split(path.sep).length - 1;
}
function dealWith(inPath, up) {
  if (!up) {
    return inPath;
  }
  if (up === true) {
    return path.basename(inPath);
  }
  if (depth(inPath) < up) {
    throw new Error('cant go up that far');
  }
  return path.join.apply(path, path.normalize(inPath).split(path.sep).slice(up));
}
module.exports = copyFiles;
function copyFiles(args, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = 0;
  }
  opts = opts || 0;
  debugArgs(args);
  debugOpts(opts);
  if (typeof callback !== 'function') {
    throw new Error('callback is not optional');
  }
  callback = once(callback);
  var input = args.slice();
  var outDir = input.pop();
  toStream(input)
  .on('error', callback)
  .pipe(new GlobStream())
  .on('error', callback)
  .pipe(new StatStream(outDir, opts))
  .on('error', callback)
  .pipe(new FinalWriteStream(outDir, opts))
  .on('error', callback)
  .on('finish', callback);
}
inherits(GlobStream, stream.Transform);
function GlobStream() {
  stream.Transform.call(this, {
    objectMode: true
  });
}
GlobStream.prototype._transform = function (pathName, _, next) {
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
};
inherits(StatStream, stream.Transform);
function StatStream(outDir, opts) {
  stream.Transform.call(this, {
    objectMode: true
  });
  this.opts = opts;
  this.outDir = outDir;
}
StatStream.prototype._transform = function (pathName, _, next) {
  var outDir = this.outDir;
  var opts = this.opts;
  fs.stat(pathName, function (err, pathStat) {
    if (err) {
      return next(err);
    }
    var outName = path.join(outDir, dealWith(pathName, opts));
    if (pathStat.isFile()) {
      mkdirp(path.dirname(outName), function (err) {
        if (err) {
          return next(err);
        }
        next(null, pathName);
      });
    } else if (pathStat.isDirectory()) {
      next();
    }
  });
};
inherits(FinalWriteStream, stream.Writable);
function FinalWriteStream(outDir, opts) {
  stream.Writable.call(this, {
    objectMode: true
  });
  this.opts = opts;
  this.outDir = outDir;
}
FinalWriteStream.prototype._write = function (pathName, _, next) {
  var outName = path.join(this.outDir, dealWith(pathName, this.opts));
  fs.createReadStream(pathName)
    .pipe(fs.createWriteStream(outName))
    .on('error', next)
    .on('finish', next);
}
