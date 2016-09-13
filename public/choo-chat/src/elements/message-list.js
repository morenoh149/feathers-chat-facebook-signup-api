// Element: messageList
//
// We can use bel instead of choo/html to keep elements modular
// and allow them to easily move outisde of the app.
const html = require('bel')

const composeMessage = require('../elements/compose-message')
const message = require('../elements/message')

function messageList (state, prev, send) {
  return html`
  <div class="flex flex-column col col-9">
    <main class="chat flex flex-column flex-1 clear">
        ${state.messagesList.map(x => {
          return message(x)
        })}
    </main>

    ${composeMessage(state, prev, send)}

  </div>
  `
}

module.exports = messageList
