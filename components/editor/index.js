const html = require('choo/html')
const raw = require('choo/html/raw')
const Nanocomponent = require('nanocomponent')
const css = require('sheetify')

const prefix = css`
  :host:focus {
    caret-color: transparent;
    outline: none;
  }

  :host .Marker {
    animation: blink 1400ms steps(5, start) infinite;
    content: "";
    display: inline-block;
    height: 2rem;
    position: relative;
    top: 0.4rem;
    width: 0.2rem;
  }

  @keyframes blink {
    to {
      visibility: hidden;
    }
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
        ${state.words.reduce((words, word) => {
          char += word.text.length + 1

          return words.concat(html`<span>${word.text}</span>`, raw`&nbsp`)
        }, [])}
        <div class="Marker bg-dark-red"></div>
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
