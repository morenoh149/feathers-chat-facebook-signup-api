const html = require('choo/html')
const messageList = require('../elements/message-list')
const userList = require('../elements/user-list')

module.exports = (state, prev, send) => html`
  <main>
    <div id="app" class="flex flex-column">
      <header class="title-bar flex flex-row flex-center">
        <div class="title-wrapper block center-element">
          <span>
            <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png" alt="Feathers Logo">
          </span>

          <span style="font-size: xx-large; font-family: monospace; opacity: 0.7;">
            <g-emoji alias="steam_locomotive" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f682.png"> <img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f682.png" alt=":steam_locomotive:" class="emoji" height="20" width="20"></g-emoji><g-emoji alias="train" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f68b.png"><img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f68b.png" alt=":train:" class="emoji" height="20" width="20"></g-emoji>choo</span>
          <span class="title">Chat </span>

          <span style="font-size: medium; margin-left: 7px; opacity: 0.7;">
            Logged in as: ${
              state.authenticated
              ? state.currentUser.email
              : state.currentUser
            }
          </span>
        </div>
      </header>
      <div class="flex flex-row flex-1 clear">
        ${userList(state, prev, send)}
        ${messageList(state, prev, send)}
      </div>
    </div>
  </main>
`
