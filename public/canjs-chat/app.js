$(function() {
  // Call to scroll to the bottom of the chat window
  function scrollToBottom() {
    const $chat = $('.chat');
    $chat.scrollTop($chat[0].scrollHeight - $chat[0].clientHeight);
  };
  // A placeholder image if the user does not have one
  const PLACEHOLDER = 'https://placeimg.com/60/60/people';
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

  // Get the Feathers services we want to use
  const userService = app.service('users');
  const messageService = app.service('messages');

  can.Component.extend({
    tag: 'chat-compose-message',
    template: `
      <form ($submit)="send" class="flex flex-row flex-space-between">
        <input type="text" name="text" {($value)}="message" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    `,
    viewModel: {
      send(ev) {
        messageService.create({
          text: this.attr('message')
        }).then(() => this.attr('message', ''));

        return false;
      }
    }
  });

  can.Component.extend({
    tag: 'chat-user-list',
    template: `
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">{{users.length}}</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list">
        {{#each users}}
        <li>
          <a class="block relative" href="#">
            <img src="{{avatar}}" alt="" class="avatar">
            <span class="absolute username">{{email}}</span>
          </a>
        </li>
        {{/each}}
      </ul>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" ($click)="logout" class="logout button button-primary">
          Sign Out
        </a>
      </footer>
    `,
    viewModel: {
      logout() {
        app.logout().then(() => window.location.href = '/login.html');
      }
    }
  });

  can.Component.extend({
    tag: 'chat-messages',
    template: `
      {{#each messages}}
      <div class="message flex flex-row">
        <img src="{{avatar sentBy.avatar}}" alt="{{sentBy.email}}" class="avatar">
        <div class="message-wrapper">
          <p class="message-header">
            <span class="username font-600">{{username sentBy.email}}</span>
            <span class="sent-date font-300">{{date createdAt}}</span>
          </p>
          <p class="message-content font-300">{{text}}</p>
        </div>
      </div>
      {{/each}}
    `,
    helpers: {
      avatar(avatar) {
        return avatar() || PLACEHOLDER;
      },

      username(email) {
        console.log('!', email(), email() || 'Anonymous')
        return email() || 'Anonymous';
      },

      date(date) {
        date = date();

        return date ? moment(date).format('MMM Do, hh:mm:ss') : '-';
      }
    }
  });

  const state = window.state = new can.Map({
    messages: [],
    users: []
  });

  $('body').append(can.stache(`
    <div id="app" class="flex flex-column">
      <header class="title-bar flex flex-row flex-center">
        <div class="title-wrapper block center-element">
          <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
            alt="Feathers Logo">
          <span class="title">Chat</span>
        </div>
      </header>

      <div class="flex flex-row flex-1 clear">
        <aside class="sidebar col col-3 flex flex-column flex-space-between">
          <chat-user-list></chat-user-list>
        </aside>

        <div class="flex flex-column col col-9">
          <main class="chat flex flex-column flex-1 clear">
            <chat-messages></chat-messages>
          </main>

          <chat-compose-message></chat-compose-message>
        </div>
      </div>
    </div>
  `)(state));

  app.authenticate().then(() => {
    // Find the latest 10 messages. They will come with the newest first
    // which is why we have to reverse before adding them
    messageService.find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    }).then(page => {
      state.attr('messages', page.data.reverse());
      scrollToBottom();
    });

    // Listen to created events and add the new message in real-time
    messageService.on('created', message => {
      state.attr('messages').push(message);
      scrollToBottom();
    });

    // Find all users
    userService.find().then(page => state.attr('users', page.data));

    // We will also see when new users get created in real-time
    userService.on('created', user => state.attr('users').push(user));
  }).catch(error => {
    if(error.code === 401) {
      window.location.href = '/login.html'
    }

    console.error(error);
  });
});
