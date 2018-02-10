module.exports = writer

const ENDPOINT = 'https://api.cognitive.microsoft.com/bing/v7.0/spellcheck?mkt=en-US&mode=proof'

function writer (state, emitter) {
  state.index = 0
  state.words = []
  state.keys = {}

  emitter.on('key', function (code, capitalize) {
    if (code === 32) {
      for (let i = 0, len = state.words.length, char = 0, word; i < len; i++) {
        word = state.words[i].text
        if (char + word.length >= state.index) {
          if (char + word.length > state.index) {
            state.words.splice(i, 0, word.substr(state.index - char))
            state.words[i] = word.substr(0, state.index - char)
            emitter.emit('spellcheck', i)
            emitter.emit('spellcheck', i + 1)
          } else {
            state.words.push({ text: '', loading: false, error: null })
            emitter.emit('spellcheck', i)
          }
          state.index += 1
          emitter.emit('render')
          return
        }
        char += (word.length + 1)
      }
    }

    let key = state.keys[code]
    if (!key) key = state.keys[code] = code

    let letter = String.fromCharCode(key)
    if (!capitalize) letter = letter.toLowerCase()

    if (!state.words.length) {
      state.words.push({ text: '', loading: false, error: null })
    }

    for (let i = 0, len = state.words.length, char = 0, word; i < len; i++) {
      word = state.words[i]
      if (char + word.text.length >= state.index) {
        if (char + word.text.length > state.index) {
          word.text = word.slice(0, state.index) + letter + word.slice(state.index)
        } else {
          word.text += letter
        }
        state.index += 1
        emitter.emit('render')
      }
      char += (word.length + 1)
    }
  })

  emitter.on('spellcheck', function (index) {
    const word = state.words[index]

    word.loading = true
    emitter.emit('render')

    window.fetch(ENDPOINT, {
      method: 'POST',
      body: `text=${word.text}`,
      headers: {
        'Content-Length': word.text.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': '766e3573dcda43ec9c3057ac8d894948'
      }
    }).then(function (response) {
      return response.json().then(function (data) {
        if (response.status !== 200) throw new Error('Could not contact api')
        if (!data.flaggedTokens[0].suggestions.length) return
        const candidate = data.flaggedTokens[0].suggestions[0].suggestion
        word.error = null
        word.loading = false
        state.index += (word.text.length - candidate.length)
        word.text = candidate
        emitter.emit('render')
      })
    }).catch(function (err) {
      word.loading = false
      word.error = err.message
      emitter.emit('render')
    })
  })
}
