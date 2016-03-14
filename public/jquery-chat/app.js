'use strict';

$(function() {
  // A placeholder image if the user does not have one
  const PLACEHOLDER = 'placeholder.png';
  // An anonymous user if the message does not have that information
  const dummyUser = {
    image: PLACEHOLDER,
    email: 'Anonymous'
  };
  // The total number of users
  let userCount = 0;

  function addUser(user) {
    // Update the number of users
    $('.online-count').html(++userCount);
    // Add the user to the list
    $('.user-list').append(`<li>
      <a class="block relative" href="#">
        <img src="${user.image || PLACEHOLDER}" alt="" class="avatar">
        <span class="absolute username">${user.email}</span>
      </a>
    </li>`);
  }

  // Renders a new message and finds the user that belongs to the message
  function addMessage(message, users) {
    // Find the user belonging to this message or use the anonymous user if not found
    const user = users.find(current => current._id === message.userId) || dummyUser;

    $('.chat').append(`<div class="message flex flex-row">
      <img src="${user.image || PLACEHOLDER}" alt="${user.email}" class="avatar">
      <div class="message-wrapper">
        <p class="message-header">
          <span class="username font-600">${user.email}</span>
          <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
        </p>
        <p class="message-content font-300">${message.text}</p>
      </div>
    </div>`);
  }

  // Establish a Socket.io connection
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

  app.authenticate().then(() => {
    // Get the Feathers services we want to use
    const userService = app.service('users');
    const messageService = app.service('messages');

    $('#send-message').on('submit', function(ev) {
      // This is the message text input field
      const input = $(this).find('[name="text"]');

      // Create a new message and then clear the input field
      messageService.create({
        text: input.val()
      }).then(message => input.val(''));

      ev.preventDefault();
    });

    $('.logout').on('click', function() {
      app.logout().then(() => window.location.href = '/login.html');
    });

    // Find all users
    userService.find().then(page => {
      const users = page.data;
      // An addMessage wrapper what also passes the list of users
      const createMessage = message => addMessage(message, users);

      // Add every user to the list
      users.forEach(addUser);

      // Find the latest 10 messages. They will come with the newest first
      // which is why we have to reverse before adding them
      messageService.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 10
        }
      }).then(page => page.data.reverse().forEach(createMessage));

      // Listen to created events and add the new message in real-time
      messageService.on('created', createMessage);
    });
    // We will also see when new users get created in real-time
    userService.on('created', addUser);
  })
  // On errors we just redirect back to the login page
  .catch(error => window.location.href = '/login.html');
});
