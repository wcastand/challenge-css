var bankai = require('bankai')
var http = require('http')
var path = require('path')
var fs = require('fs')

var clientPath = path.join(__dirname, 'src/index.js')
var assets = bankai(clientPath, {
  js: { transform: ['babelify'] },
  html: { head: '<script src="./three.min.js"></script><script src="./tween.min.js"></script>'}
})

http.createServer((req, res) => {
  switch (req.url) {
    case '/': return assets.html(req, res).pipe(res)
    case '/bundle.js': return assets.js(req, res).pipe(res)
    case '/bundle.css': return assets.css(req, res).pipe(res)
    case '/three.min.js': return res.end(fs.readFileSync('./vendors/three.min.js', 'utf-8'))
    case '/tween.min.js': return res.end(fs.readFileSync('./vendors/tween.min.js', 'utf-8'))
    default: return (res.statusCode = 404 && res.end('404 not found'))
  }
}).listen(8080)
