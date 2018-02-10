const html = require('choo/html')
const Editor = require('../components/editor')

const TITLE = 'Stoopid Editor'
const editor = new Editor()

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="flex justify-center w-100">
      ${editor.render(state, emit)}
    </body>
  `
}
