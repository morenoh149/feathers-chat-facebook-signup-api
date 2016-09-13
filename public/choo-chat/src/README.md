# feathers-choo-chat [![built with choo v3](https://img.shields.io/badge/built%20with%20choo-v3-ffc3e4.svg?style=flat-square)](https://github.com/yoshuawuyts/choo)

## Getting started

in `config/default.json` replace the line:

```
"successRedirect": "/jquery-chat/"
```

with the new line:

```
"successRedirect": "/choo-chat/"
```

then build the `choo` client and start the `Feathers` server

```
cd public/choo-chat/src
npm run build:dev
cd ../../..
npm start
chromium-browser http://localhost:3030/choo-chat/ --new-window --auto-open-devtools-for-tabs
```

you can also start the server and then, in a second terminal, run :

```
cd public/choo-chat/src
nodemon -x 'npm run build:dev'
```

---

##### How to generate a new `Feathers` + `choo` chat app project

clone the chat app:

```
git clone https://github.com/feathersjs/feathers-chat.git
cd feathers-chat
```

duplicate the `vue-chat` folder for default `index.html` and file structure

```
cp -r public/vue-chat public/choo-chat
cd public/choo-chat
```

install the `choo-cli` generator and generate a new project inside the `src` folder

```
npm install choo-cli -g
choo new src
```

add `fethers-client`, `socket.io`, dependencies and some other dev-dependencies for building and logging

```
cd src
npm i -S feathers-client socket.io-client moment choo-log
npm i -D envify unassertify uglifyify sheetify
```

build the `choo` client, start the `feathers` server and open the `chat` app in the broswer

```
npm run build:dev
cd ../../..
npm start
chromium-browser http://localhost:3030/choo-chat/ --new-window --auto-open-devtools-for-tabs
```

(optional) add to `.gitignore` the generated bundle

```
# Files generated with Browserify
public/choo-chat/app.js
```

## choo-cli generated README.md

Choo-cli created a directory structure that [we've found to be optimal](https://github.com/yoshuawuyts/choo-handbook/blob/master/designing-for-reusability.md) for slim
applications and reusability.

```txt
assets/        images and fonts, if you have any
elements/      standalone application-specific elements
lib/           generalized components, should be moved out of project later
models/        choo models
pages/         views that are directly mounted on the router
scripts/       shell scripts, to be interfaced with through `npm scripts`
client.js      main application entry; programmatic manifest file
package.json   manifest file
```

You can use choo-cli to generate pieces of your project as you are developing.
For example you can generate

Pages
```bash
$ choo generate page my-page
```

Models
```bash
$ choo generate model my-model
```

Elements
```bash
$ choo generate element my-element
```

## npm scripts

Choo-cli was made for generating choo projects and code, and leverages npm scripts
for certain project task. So in our project a set of npm scripts have already
been generated that perform various tasks such as testing/serving/building/etc.

At any time you can review the complete list of `npm scripts` available by viewing
[package.json](./package.json) or by running the following command:

```
$ npm run
```

Here is complete list the the commands and their function
- start - start dev server at [localhost:8080](https://localhost:8080)
- build - builds your project to deploy to a server
- test - runs unit tests, for now it will just run linting.
- lint - runs eslint against your code

So for example you can run `npm start` to start a dev server. You can now see your
app running at [localhost:8080](https://localhost:8080)
