module.exports = writer

function writer (state, emitter) {
  state.index = 0
  state.words = []
  state.keys = {}

  emitter.on('delete', function () {
    const word = state.words[state.words.length - 1]
    word.text = word.text.slice(0, -1)
    console.log(word.text.length)
    state.index -= 1

    emitter.emit('render')
  })

  emitter.on('key', function (character) {
    const { code, capitalize } = character

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
            state.words.push(createWord())
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

    let letter = String.fromCharCode(key).toLowerCase()
    if (capitalize)
    if (!capitalize) letter = letter.toLowerCase()

    if (!state.words.length) {
      state.words.push(createWord())
    }

    for (let i = 0, len = state.words.length, char = 0, word; i < len; i++) {
      word = state.words[i]
      if (char + word.text.length >= state.index) {
        if (char + word.text.length > state.index) {
          word.text = word.text.slice(0, state.index) + letter + word.text.slice(state.index)
        } else {
          word.text += letter
          word.capitalized.push(capitalize)
        }
        state.index += 1
        emitter.emit('render')
      }
      char += (word.text.length + 1)
    }
  })

  emitter.on('spellcheck', function (index) {
    const word = state.words[index]

    word.loading = true
    emitter.emit('render')

    window.fetch('/spellcheck', {
      method: 'POST',
      body: word.text
    }).then(function (response) {
      return response.json().then(function (data) {
        if (response.status !== 200) throw new Error('Could not contact api')
        const candidate = data.find((word) => /^[a-z]+$/i.test(word))

        if (!candidate) return

        for (let i = 0, len = word.text.length; i < len; i++) {
          if (!candidate[i]) break
          if (word.text[i] !== candidate[i]) {
            state.keys[word.text.toUpperCase().charCodeAt(i)] = candidate.toUpperCase().charCodeAt(i)
          }
        }

        word.error = null
        word.loading = false
        state.index += (candidate.length - word.text.length)
        word.text = candidate
        emitter.emit('render')
      })
    }).catch(function (err) {
      word.loading = false
      word.error = err.message
      emitter.emit('render')
    })
  })

  emitter.on('move', function (num) {
    let total = state.words.reduce(function (length, word) {
      return length + word.text.length + 1
    }, 0)

    // remove trailing space
    total -= 1

    // exit of cursor is already at the end
    if (num > 0 && state.index === total) return

    state.index += num
    emitter.emit('render')
  })
}

const createWord = () => {
  return {
    text: '',
    loading: false,
    error: null,
    capitalized: []
  }
}
