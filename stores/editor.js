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
      for (let i = 0, len = state.words.length, char = 0, text; i < len; i++) {
        text = state.words[i].text
        if (char + text.length >= state.index) {
          if (char + text.length > state.index) {
            const capitalized = state.words[i].capitalized
            state.words.splice(i, 0, Object.assign({}, state.words[i], {
              text: text.substr(state.index - char),
              capitalized: capitalized.slice(state.index - char)
            }))
            state.words[i].text = text.substr(0, state.index - char)
            state.words[i].capitalized = capitalized.slice(
              state.index - char,
              capitalized.length
            )
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
        char += (text.length + 1)
      }
    }

    let key = state.keys[code]
    if (!key) key = state.keys[code] = code
    const letter = String.fromCharCode(key).toLowerCase()

    if (!state.words.length) {
      state.words.push(createWord())
    }

    for (let i = 0, len = state.words.length, char = 0, text; i < len; i++) {
      text = state.words[i].text
      if (state.index >= char && char + text.length >= state.index) {
        if (char + text.length > state.index) {
          const index = state.index - char
          state.words[i].text = text.slice(0, index) + letter + text.slice(index)
        } else {
          state.words[i].capitalized.push(capitalize)
          state.words[i].text += letter
        }
        state.index += 1
        emitter.emit('render')
      }
      char += (text.length + 1)
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
      return response.json().then(function (result) {
        if (response.status !== 200) throw new Error('Could not contact api')
        if (result.status === 'ok') return

        const candidate = result.suggestions.find((word) => /^[a-z]+$/i.test(word))

        if (!candidate) {
          word.error = result.status
          return emitter.emit('render')
        }

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
