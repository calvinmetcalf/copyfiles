var path = require('path')
var fs = require('fs')

function mkdirp(directory) {
  var dirPath = path.resolve(directory).replace(/\/$/, '').split(path.sep);
  for (var i = 1; i <= dirPath.length; i++) {
    var segment = dirPath.slice(0, i).join(path.sep);
    if (!fs.existsSync(segment) && segment.length > 0) {
      fs.mkdirSync(segment);
    }
  }
}

module.exports = mkdirp