const html = require('choo/html')
const raw = require('choo/html/raw')
const Nanocomponent = require('nanocomponent')
const css = require('sheetify')
const marker = require('../marker')

const prefix = css`
  :host:focus {
    caret-color: transparent;
    outline: none;
  }
`

module.exports = class Editor extends Nanocomponent {
  load (el) {
    el.focus()
  }

  update () {
    return true
  }

  createElement (state, emit) {
    let char = 0

    return html`
      <div onkeydown=${onkeydown} contenteditable="true" class="${prefix} relative ma3 f3 lh-copy sans-serif mw7 w-80 vh-100">
        ${state.words.length ? state.words.reduce((words, word) => {
          char += word.text.length + 1
          const list = []

          if (!word.text) {
            return words
          } else if (char - 1 === state.index) {
            list.push(html`<span>${word.text}</span>`, marker())
          } else {
            list.push(html`<span>${word.text}</span>`, raw`&nbsp`)
            if (char === state.index) list.push(marker())
          }

          return words.concat(list)
        }, []) : marker()}
      </div>
    `

    function onkeydown (event) {
      event.preventDefault()

      const code = event.keyCode
      if ((code >= 65 && code <= 90) || code === 32) {
        emit('key', event.keyCode, event.shiftKey)
      } else if (code >= 37 && code <= 40) {
        emit('move', code)
      } else if (code === 8) {
        emit('delete')
      }
    }
  }
}
