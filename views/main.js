const html = require('choo/html')
const Editor = require('../components/editor')

const TITLE = 'Stoopid Editor'
const editor = new Editor()

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="flex flex-column justify-start items-center w-100 lh-copy sans-serif">
      <h1 class="mh3 mv4 f-subheadline lh-title b mw7 w-80">Stoopid Editor</h1>
      ${editor.render(state, emit)}
    </body>
  `
}
