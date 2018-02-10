const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host {
    animation: blink 1400ms steps(5, start) infinite;
    content: "";
    display: inline-block;
    height: 2.4rem;
    position: relative;
    top: 0.4rem;
    width: 0.3rem;
    background-color: #999;
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
    <div class="${prefix}"></div>
  `
}
