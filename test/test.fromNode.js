'use strict';
var test = require('tape');
var copyfiles = require('../');
var rimraf = require('rimraf');
var fs = require('fs');
var mkdirp = require('mkdirp');

function after(t) {
  rimraf('output', function (err) {
    t.error(err, 'rm out');
    rimraf('input', function (err) {
      t.error(err, 'rm input');
      t.end();
    });
  });
}
function before(t) {
  mkdirp('input/other', function (err) {
      t.error(err, 'rm input');
      t.end();
    });
}

test('normal', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    copyfiles(['input/*.txt', 'output'], function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});

test('with up', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    copyfiles(['input/*.txt', 'output'], 1, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});

test('with up 2', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/other/a.txt', 'a');
    fs.writeFileSync('input/other/b.txt', 'b');
    fs.writeFileSync('input/other/c.js', 'c');
    copyfiles(['input/**/*.txt', 'output'], 2, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('flatten', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/other/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/other/c.js', 'c');
    copyfiles(['input/**/*.txt', 'output'], true, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
