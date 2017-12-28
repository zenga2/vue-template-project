var fs = require('fs')
var path = require('path')
var archiver = require('archiver')
var config = require('../package')

var obj = JSON.parse(process.env.npm_config_argv)
var zipFileName = obj.remain[0]
zipFileName = zipFileName
  ? zipFileName + '.zip'
  : config.buildName + '-' + config.version + '.zip'

var output = fs.createWriteStream(path.resolve(__dirname, '../dist_zip/' + zipFileName))

var archive = archiver('zip', {
  zlib: {level: 9}
})

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes')
  console.log('Zip complete')
})

archive.pipe(output)
archive.directory(path.resolve(__dirname, '../dist/'), '/')
archive.finalize()