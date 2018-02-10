const css = require('sheetify')
const html = require('choo/html')
const Component = require('nanocomponent')

const keys = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72,
  74, 75, 76, 90, 88, 76, 86, 66, 78, 77]

const container = css`
  :host {
    width: 100%;
    height: 0;
    position: fixed;
    left: 0;
    bottom: 0;
  }
`

const button = css`
  :host {
    width: 80px;
    padding: 8px 8px 5px;
    border: 0;
    position: absolute;
    right: 20px;
    bottom: 20px;
    outline: none;
    background: #dcdcdc;
  }

  :host svg {
    width: 100%;
    height: auto;
  }
`

const keyboard = css`
  :host {
    position: absolute;
    left: 50%;
    bottom: 0;
    pointer-events: none;
    opacity: 0.5;
    transform: translate(-50%, 0);
    animation: keyboard-appear 325ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
    will-change: transform;
    text-align: center;
  }

  @keyframes keyboard-appear {
    to {
      opacity: 1;
      transform: translate(-50%, -25%);
    }
  }

  :host .key {
    display: inline-block;
    padding: 0.5em;
    font-weight: bold;
    color: #dcdcdc;
  }

  :host .key.is-moved {
    color: #dc143c;
  }
`

module.exports = class Inspector extends Component {
  update () {
    return true
  }

  createElement (state) {
    const self = this

    const chars = []
    const breakpoints = [81, 65, 90]
    for (let i = 0, len = keys.length; i < len; i++) {
      if (breakpoints.includes(keys[i])) chars.push([])
      chars[chars.length - 1].push({
        char: String.fromCharCode(state.keys[keys[i]] || keys[i]),
        moved: state.keys[keys[i]] && state.keys[keys[i]] !== keys[i],
        code: keys[i]
      })
    }

    return html`
      <div class="${container}">
        <button class="${button}" onclick=${toggle}>
          <svg width="74px" height="32px" viewBox="0 0 74 32">
            <path fill="#fff" d="M61 11l-1-1V8l1-1h4l1 1v2l-1 1h-4zm1 4v2l-1 1h-4l-1-1v-2l1-1h4l1 1zM56 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1h-4l-1-1V8l1-1h4l1 1zM25 22l1-1h4l1 1v2l-1 1h-4l-1-1v-2zm-4-4l-1-1v-2l1-1h4l1 1v2l-1 1h-4zm9 0l-1-1v-2l1-1h4l1 1v2l-1 1h-4zm4 4l1-1h4l1 1v2l-1 1h-4l-1-1v-2zm5-4l-1-1v-2l1-1h4l1 1v2l-1 1h-4zm4 4l1-1h4l1 1v2l-1 1h-4l-1-1v-2zm5-4l-1-1v-2l1-1h4l1 1v2l-1 1h-4zM47 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1h-4l-1-1V8l1-1h4l1 1zM38 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1h-4l-1-1V8l1-1h4l1 1zM29 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1h-4l-1-1V8l1-1h4l1 1zM20 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1h-4l-1-1V8l1-1h4l1 1zm-4 7v2l-1 1h-4l-1-1v-2l1-1h4l1 1zM11 1l1-1h4l1 1v2l-1 1h-4l-1-1V1zm1 7v2l-1 1H7l-1-1V8l1-1h4l1 1zM0 1l1-1h6l1 1v2L7 4H1L0 3V1zm0 7l1-1h2l1 1v2l-1 1H1l-1-1V8zm0 7l1-1h6l1 1v2l-1 1H1l-1-1v-2zm0 7l1-1h2l1 1v2l-1 1H1l-1-1v-2zm8 9l-1 1H1l-1-1v-2l1-1h6l1 1v2zm-1-7v-2l1-1h4l1 1v2l-1 1H8l-1-1zm10 7l-1 1h-4l-1-1v-2l1-1h4l1 1v2zm-1-7v-2l1-1h4l1 1v2l-1 1h-4l-1-1zm37 7l-1 1H21l-1-1v-2l1-1h31l1 1v2zm-1-7v-2l1-1h4l1 1v2l-1 1h-4l-1-1zm10 7l-1 1h-4l-1-1v-2l1-1h4l1 1v2zm-1-7v-2l1-1h4l1 1v2l-1 1h-4l-1-1zm13 7l-1 1h-7l-1-1v-2l1-1h7l1 1v2zm0-7l-1 1h-2l-1-1v-2l1-1h2l1 1v2zm0-7l-1 1h-7l-1-1v-2l1-1h7l1 1v2zm0-7l-1 1h-3l-1-1V8l1-1h3l1 1v2zm0-7l-1 1h-7l-1-1V1l1-1h7l1 1v2z"/>
          </svg>
        </button>
        ${this.expanded ? html`
          <div class="${keyboard}">
            ${chars.map(keys => html`
              <div class="row">
                ${keys.map(key => html`<span class="key ${key.moved ? 'is-moved' : ''}">${key.char}</span>`)}
              </div>
            `)}
          </div>
        ` : null}
      </div>
    `

    function toggle () {
      self.expanded = !self.expanded
      self.rerender()
    }
  }
}
