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
    let marked = false
    const content = []
    for (let i = 0, char = 0, len = state.words.length, text; i < len; i++) {
      text = state.words[i].text

      if (!text) continue

      if (char + text.length === state.index) {
        marked = true
        content.push(html`<span>${text}</span>`, marker())
      } else {
        if (char + text.length > state.index && !marked) {
          marked = true
          const index = state.index - char
          const parts = [text.substr(0, index), marker(), text.substr(index)]
          content.push(html`<span>${parts}</span>`)
        } else {
          content.push(html`<span>${text}</span>`)
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
      <div onkeydown=${onkeydown} contenteditable="true" class="${prefix} relative ma3 f3 lh-copy sans-serif mw7 w-80 vh-100">
        ${content.length ? content : marker()}
      </div>
    `

    function onkeydown (event) {
      event.preventDefault()

      const code = event.keyCode
      if ((code >= 65 && code <= 90) || code === 32) {
        emit('key', event.keyCode, event.shiftKey)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        emit('move', event.key === 'ArrowRight' ? 1 : -1)
      } else if (code === 8) {
        emit('delete')
      }
    }
  }
}
