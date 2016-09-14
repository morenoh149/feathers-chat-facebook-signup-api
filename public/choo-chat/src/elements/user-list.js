// Element: userList
//
// We can use bel instead of choo/html to keep elements modular
// and allow them to easily move outisde of the app.
const html = require('bel')

// A placeholder image if the user does not have one
// const PLACEHOLDER = 'https://placeimg.com/60/60/people'
const PLACEHOLDER = 'http://b.dryicons.com/images/icon_sets/distortion_icons_set/png/128x128/user.png'

// An anonymous user if the message does not have that information
const dummyUser = {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
}

function userList (state, prev, send) {
  return html`
  <aside class="sidebar col col-3 flex flex-column flex-space-between">
    <header class="flex flex-row flex-center">
      <h4 class="font-300 text-center"><span class="font-600 online-count" v-cloak>{{ users.length }}</span> users</h4>
    </header>
    <ul class="flex flex-column flex-1 list-unstyled user-list">
      ${state.usersList.map(x => html`
        <li>
          <a class="block relative" href="#">
          <img src=${x.avatar || dummyUser.avatar} alt="avatar" class="avatar">
          <span class="absolute username">
            ${x.email || dummyUser.email}
          </span>
          </a>
        </li>
        `)
      }
    </ul>
    <footer class="flex flex-row flex-center">
      <a href="/login.html" class="logout button button-primary"
        @click="logout"
        onclick=${(e) => {
          console.log(e)
          send('logOut', { value: false })
        }}
      >
        Sign Out
      </a>
    </footer>
  </aside>
  `
}

//   <li v-for="user in users" track-by="$index" v-cloak>
//   </li>

module.exports = userList
