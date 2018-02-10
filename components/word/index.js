const html = require('choo/html')
const css = require('sheetify')

const prefix = css`
  :host {
    display: inline-block;
    padding: 0 .05em .1em;
    line-height: 1;
  }

  :host.error {
    background-color: crimson;
    border-radius: 2px;
    display: inline-block;
    padding: 0 .05em .1em;
    line-height: 1;
  }

  .container {
    margin: auto;
    position: relative;
  }

  .frills, .frills:after, .frills:before {
    background: #eb1f48;
    border-radius: 4px;
    height: 8px;
    position: absolute;
  }

  .frills:after, .frills:before {
    content: "";
    display: block;
  }

  .frills:before {
    bottom: 45px;
  }

  .frills:after {
    top: 45px;
  }

  .left-frills {
    right: 164px;
    top: 28.5px;
  }

  .active .left-frills {
    animation: move-left 380ms ease-out, width-to-zero 380ms ease-out;
  }

  .left-frills:before, .left-frills:after {
    left: 15px;
  }

  .active .left-frills:before {
    animation: width-to-zero 380ms ease-out, move-up 380ms ease-out;
  }

  .active .left-frills:after {
    animation: width-to-zero 380ms ease-out, move-down 380ms ease-out;
  }

  .right-frills {
    left: 164px;
    top: 28.5px;
  }
  .active .right-frills {
    animation: move-right 380ms ease-out, width-to-zero 380ms ease-out;
  }

  .right-frills:before, .right-frills:after {
    right: 15px;
  }

  .active .right-frills:before {
    animation: width-to-zero 380ms ease-out, move-up 380ms ease-out;
  }

  .active .right-frills:after {
    animation: width-to-zero 380ms ease-out, move-down 380ms ease-out;
  }

  .left-frills:before, .right-frills:after {
    transform: rotate(34deg);
  }

  .left-frills:after, .right-frills:before {
    transform: rotate(-34deg);
  }

  @-webkit-keyframes move-left {
    0% {
      transform: none;
    }
    65% {
      transform: translateX(-80px);
    }
    100% {
      transform: translateX(-80px);
    }
  }

  @keyframes move-left {
    0% {
      transform: none;
    }
    65% {
      transform: translateX(-80px);
    }
    100% {
      transform: translateX(-80px);
    }
  }
  @keyframes move-right {
    0% {
      transform: none;
    }
    65% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(80px);
    }
  }

  @keyframes width-to-zero {
    0% {
      width: 38px;
    }
    100% {
      width: 8px;
    }
  }

  @keyframes move-up {
    100% {
      bottom: 69.75px;
    }
  }
  @keyframes move-down {
    100% {
      top: 69.75px;
    }
  }
`

module.exports = word

function word (text, props) {
  const { corrected, error } = props
  return html`
    <span class="container ${corrected ? 'active' : ''}">
      <div class="left-frills frills"></div>
        <span class="${prefix} ${error ? 'white error' : ''}">
          ${text}
        </span>
      <div class="right-frills frills"></div>
    </span>
  `
}
