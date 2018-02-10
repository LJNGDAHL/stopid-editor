const http = require('http')
const bankai = require('bankai/http')
const Spellchecker = require('spellchecker')

const compiler = bankai(__dirname)

const server = http.createServer(function (req, res) {
  if (req.url === '/spellcheck') {
    let text = ''

    req.on('data', function (chunk) {
      text += chunk
    })

    req.on('end', function () {
      try {
        const checked = Spellchecker.getCorrectionsForMisspelling(text.toString())
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(checked))
      } catch (err) {
        res.statusCode = 400
        res.sendDate(err.message)
      }
    })

    req.on('error', function (err) {
      res.statusCode = 400
      res.sendDate(err.message)
    })
  } else {
    compiler(req, res, function () {
      res.statusCode = 404
      res.end('not found')
    })
  }
})

server.listen(process.env.PORT || 8080)
