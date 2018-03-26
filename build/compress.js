var fs = require('fs')
var path = require('path')
var archiver = require('archiver')
var pkg = require('../package')

var urlOfTargetFile = path.resolve(__dirname, '../src/global.config_1.js')
var codeStr = fs.readFileSync(
  path.resolve(__dirname, '../src/global.config.js'),
  'utf8'
).replace('export default', 'module.exports =')
fs.writeFileSync(
  urlOfTargetFile,
  codeStr,
  'utf8'
)
var config = require('../src/global.config_1')
fs.unlinkSync(urlOfTargetFile)

// update app version
pkg.version = config.version
fs.writeFileSync(
  path.resolve(__dirname, '../package.json'),
  JSON.stringify(pkg, null, '  ') + '\n',
  'utf8',
)

if (!fs.existsSync('dist_zip')) {
  fs.mkdirSync('dist_zip')
}
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