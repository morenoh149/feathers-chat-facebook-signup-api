// Element: message
//
// We can use bel instead of choo/html to keep elements modular
// and allow them to easily move outisde of the app.
const html = require('bel')

const moment = require('moment')

const PLACEHOLDER = 'http://b.dryicons.com/images/icon_sets/distortion_icons_set/png/128x128/user.png'

function message (msg) {
  return html`
  <div class="message flex flex-row">
    <img src=${msg.sentBy ? msg.sentBy.avatar : PLACEHOLDER} alt=${msg.sentBy ? msg.sentBy.email : 'Anonymous'} class="avatar">
    <div class="message-wrapper">
      <p class="message-header">
        <span class="username font-600">${msg.sentBy ? msg.sentBy.email : 'Anonymous'}</span>
        <span class="sent-date font-300">${msg.createdAt ? moment(msg.createdAt).format('MMM Do, hh:mm:ss') : moment(0).format('MMM Do, hh:mm:ss')}</span>
      </p>
      <p class="message-content font-300">${msg.text ? msg.text : 'default text'}</p>
    </div>
  </div>
  `
}

module.exports = message
