// Initialize Feathers app
const fapp = require('./feathers-app')

// Get the Feathers services we want to use
const userService = fapp.service('users')
const messageService = fapp.service('messages')

module.exports = {
  subscriptions: [
    // asynchronous read-only operations that don't modify state directly.
    // Can call actions. Signature of (send, done).
    /*
    (send, done) => {
      // do stuff
    }
    */
    (send, done) => {
      fapp.authenticate()
      .then((res) => {
        send('authenticate', {value: true}, () => {
          send('setUser', {user: fapp.get('user')}, () => {})

          // Find all users
          userService.find()
          .then((data) => {
            send('concatUsers', {value: data.data}, () => {})
          })
          .catch((err) => { console.error(err) })

          // We will also see when new users get created in real-time
          userService.on('created', user => {
            send('concatUsers', {value: [ user ]}, () => {})
          })

          // Find the latest 10 messages. They will come with the newest first
          // which is why we have to reverse before adding them
          messageService.find({
            query: {
              $sort: {createdAt: -1},
              $limit: 25
            }
          }).then(page => {
            page.data.reverse()
            send('concatMessages', {value: page.data}, () => {})
            send('scrollToBottom', {}, () => {})
          })

          // Listen to created events and add the new message in real-time
          messageService.on('created', message => {
            send('concatMessages', {value: [message]}, () => {})
            send('scrollToBottom', {}, () => {})
          })
        })
      })
      // On errors we just redirect back to the login page
      .catch(error => {
        if (error.code === 401) window.location.href = '/login.html'
      })
    }
  ],
  effects: {
    // asynchronous operations that don't modify state directly.
    // Triggered by actions, can call actions. Signature of (data, state, send, done)
    /*
    myEffect: (data, state, send, done) => {
      // do stuff
    }
    */
    logOut: (data, state, send, done) => {
      fapp.logout()
        .then(() => {
          send('setUser', { user: 'anonymous guest' }, () => {})
          send('authenticate', { value: data.value }, () => {})
          // send('location:setLocation', { location: href })
          window.location.href = '/login.html'
        })
        .catch(error => {
          console.error(error)
        })
    },
    createMessage: (data, state, send, done) => {
      // Create a new message from the input field
      messageService.create({text: data.value})

      // Local choo client only version
      // send('concatMessages', { value: [{
      //   sentBy: {
      //     avatar: state.currentUser.avatar,
      //     email: state.currentUser.email
      //   },
      //   createdAt: time,
      //   text: data.value
      // }] }, () => {})
    },
    scrollToBottom: () => setTimeout(() => {
      document.querySelector('#app > div > div > main > div:last-child').scrollIntoView(true)
    }, 500)
  },
  reducers: {
    /* synchronous operations that modify state. Triggered by actions. Signature of (data, state). */
    concatUsers: (action, state) => ({
      usersList: state.usersList.concat(action.value)
    }),
    concatMessages: (action, state) => ({
      messagesList: state.messagesList.concat(action.value)
    }),
    updateCurentMessage: (action, state) => ({
      currentMessage: action.value
    }),
    authenticate: (action, state) => ({ authenticated: action.value }),
    setUser: (action, state) => ({ currentUser: action.user })
  },
  state: {
    /* initial values of state inside the model */
    usersList: [ ],
    authenticated: false,
    currentUser: 'anonymous guest',
    messagesList: [ ],
    currentMessage: ''
  }
}
