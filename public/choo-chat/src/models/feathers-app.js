// Setting up socket.io
const io = require('socket.io-client')
// Establish a Socket.io connection
const socket = io('http://localhost:3030')

// Setting up Feathers
const feathers = require('feathers-client')

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }))

module.exports = app
