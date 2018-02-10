const html = require('choo/html')
const raw = require('choo/html/raw')
const Nanocomponent = require('nanocomponent')
const css = require('sheetify')
const marker = require('../marker')
const word = require('../word')

const editorPrefix = css`
  :host:focus {
    caret-color: transparent;
    outline: none;
  }
`

module.exports = class Editor extends Nanocomponent {
  load (el) {
    el.focus()
    window.addEventListener('click', function () {
      el.focus()
    })
  }

  update () {
    return true
  }

  createElement (state, emit) {
    let marked = false
    const content = []
    for (let i = 0, char = 0, len = state.words.length, text; i < len; i++) {
      text = capitalize(state.words[i].text, state.words[i].capitalized)

      if (!text) continue

      if (char + text.length === state.index) {
        marked = true
        content.push(word(text, state.words[i]), marker())
      } else {
        if (char + text.length > state.index && !marked) {
          marked = true
          const index = state.index - char
          const parts = [text.substr(0, index), marker(), text.substr(index)]
          content.push(word(parts, state.words[i]))
        } else {
          content.push(word(text, state.words[i]))
        }

        content.push(raw`&nbsp;`)

        if (char + text.length + 1 === state.index) {
          marked = true
          content.push(marker())
        }
      }

      char += text.length + 1
    }

    return html`
      <div onkeydown=${onkeydown} contenteditable="true" class="${editorPrefix} relative mh3 mb5 f2 lh-copy sans-serif mw7 w-80 flex-auto">
        ${content.length ? content : marker()}
      </div>
    `

    function onkeydown (event) {
      event.preventDefault()

      const code = event.keyCode
      if ((code >= 65 && code <= 90) || code === 32) {
        emit('key', { code: event.keyCode, capitalize: event.shiftKey })
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        emit('move', event.key === 'ArrowRight' ? 1 : -1)
      } else if (code === 8) {
        emit('delete')
      }
    }
  }
}

function capitalize (text, capitalized) {
  return text.split('').map((character, index) => {
    if (capitalized[index]) {
      return character.toUpperCase()
    } else {
      return character
    }
  }).join('')
}

