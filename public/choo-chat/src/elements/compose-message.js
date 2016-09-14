// Element: composeMessage
//
// We can use bel instead of choo/html to keep elements modular
// and allow them to easily move outisde of the app.
const html = require('bel')

function composeMessage (state, prev, send) {
  return html`
  <form class="flex flex-row flex-space-between" id="send-message" v-on:submit.prevent action="">
    <input type="text" name="text" class="flex flex-1"
      value="${state.currentMessage}"
      v-model="newMessage"
      oninput=${e => send('updateCurentMessage', { value: e.target.value })}
    >
    <button class="button-primary" type="submit"
      onclick=${(e) => {
        e.preventDefault()
        e.stopPropagation()
        send('createMessage', { value: state.currentMessage }, () => {})
        send('updateCurentMessage', { value: '' })
      }}
      @click="addMessage"
    >
      Send
    </button>
  </form>
  `
}

module.exports = composeMessage
