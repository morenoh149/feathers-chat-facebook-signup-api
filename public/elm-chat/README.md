# Feather Chat in Elm

* `feathers.js` - Here's mostly FeathersJS stuff, but we also connect Javascript with Elm in here and tell Elm to render (if we are authenticated)
* `elm-package.json` - This file is like `package.json` for node, but for Elm!
* `src/Main.elm` - The entrypoint for our Elm application
* `src/Models.elm` - All our Elm types
* `src/View.elm` - The view function and helpers

## Setup

> You need Elm installed (`npm install -g elm`) to use this.

```bash
elm-install -y
elm-make src/Main.elm --output elm.js
```

Now you can see it in action at http://localhost:3030/elm-chat (if you followed the instructions in the other readme)
