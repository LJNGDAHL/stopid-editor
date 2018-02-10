const html = require('choo/html')
const raw = require('choo/html/raw')
const Nanocomponent = require('nanocomponent')
const css = require('sheetify')

const prefix = css`
  :host:focus {
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
    return html`
      <div onkeydown=${onkeydown} contenteditable="true" class="${prefix} ma3 f3 lh-copy sans-serif mw7 w-80 vh-100">
        ${state.words.reduce((words, word) => {
          return words.concat(html`<span>${word.text}</span>`, raw`&nbsp`)
        }, [])}
      </div>
    `

    function onkeydown (event) {
      event.preventDefault()

      const code = event.keyCode
      if ((code >= 65 && code <= 90) || code === 32) {
        emit('key', event.keyCode, event.shiftKey)
      }
    }
  }
}
