/* globals io: true, feathers: true, window: true, Elm: true */
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

function logout() {
  app.logout().then(() => window.location.href = '/login.html');
}

const messageService = app.service('messages');
const userService = app.service('users');

function messages(messagesIn, sendMessage) {
  /*
   * messagesIn.send(object) will send an object to Elm which
   * we will map to an action in 'inputsignal'

   * sendMessage.subscribe(function(data)) will run every time we send
   * data from Elm to Javascript and we cant handle it here
   */
  sendMessage.subscribe(data => {
    app.service('messages').create({
      text: data,
    });
  });

  // Start with the 10 latest posts
  messageService.find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 10
    }
  }, (error, data) => {
    data.data.map(messagesIn.send);
  });

  // Subscribe to incoming messages from Feather and send to Elm
  messageService.on('created', messagesIn.send);
}

function users(usersPort) {
  // Find all users initially
  userService.find({}, (error, data) => {
    data.data.map(usersPort.send);
  });
  // Listen to new users so we can show them in real-time
  userService.on('created', usersPort.send);
}

// Dummy data
const emptyUser = {
  avatar: '',
  email: '',
};
const emptyMessage = {
  createdAt: 0,
  sentBy: emptyUser,
  text: '',
};

app.authenticate().then(() => {
  // Load up the Elm application in Fullscreen
  var elm = Elm.Main.fullscreen();

  const {
    messagesIn,
    sendMessage,
    usersPort,
    logoutPort,
  } = elm.ports;

  // Here we pass the ports to our Javascript functions
  messages(messagesIn, sendMessage);
  users(usersPort);
  logoutPort.subscribe(logout); // this one is much simpler
}).catch(error => {
  console.error(error);
  window.location.href = '/login.html';
});
