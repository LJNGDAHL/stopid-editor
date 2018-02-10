const html = require('choo/html')
const Nanocomponent = require('nanocomponent')


module.exports = class Editor extends Nanocomponent {
  load (el) {
    el.focus()
  }

  update () {
    return true
  }

  createElement (state, emit) {
  return html`
      <div contenteditable="true" autofocus class="f3 lh-copy ba sans-serif mw7 w-80 vh-100"></div>
    `
  }
}
