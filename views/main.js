const html = require('choo/html')
const Editor = require('../components/editor')
const Inspector = require('../components/inspector')
const css = require('sheetify')

const TITLE = 'Stopid Editor'
const editor = new Editor('editor')
const inspector = new Inspector('inspector')


const prefix = css`
  :host .misspelled {
    background-color: 'crimson';
    border-radius: 2px;
    color: #fff;
  }
`

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="${prefix} flex flex-column justify-start items-center w-100 lh-copy sans-serif">
      <h1 class="mh3 mv4 f1 lh-title b mw7 w-80">St<span class="misspelled">o</span>pid Editor</h1>
      ${editor.render(state, emit)}
      ${inspector.render(state)}
    </body>
  `
}
