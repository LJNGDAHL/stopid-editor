const http = require('http')
const bankai = require('bankai/http')
const SpellChecker = require('spellchecker')

const compiler = bankai(__dirname)

const server = http.createServer(function (req, res) {
  if (req.url === '/spellcheck') {
    let text = ''

    req.on('data', function (chunk) {
      text += chunk
    })

    req.on('end', function () {
      try {
        let response = []
        const word = text.toString()
        if (SpellChecker.isMisspelled(word)) {
          response = SpellChecker.getCorrectionsForMisspelling(text.toString())
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(response))
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
