const html = require('choo/html')
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
      <div contenteditable="true" class="${prefix} ma3 f3 lh-copy sans-serif mw7 w-80 vh-100"></div>
    `
  }
}
