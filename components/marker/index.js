const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host {
    animation: blink 1400ms steps(5, start) infinite;
    content: "";
    display: inline-block;
    height: 2rem;
    left: -0.4rem;
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

module.exports = marker

function marker () {
  return html`
    <div class="${prefix} bg-dark-red"></div>
  `
}