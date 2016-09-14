const choo = require('choo')
const app = choo()

// this block of code will be eliminated by any minification if
// NODE_ENV is set to "production"
if (process.env.NODE_ENV !== 'production') {
  const log = require('choo-log')
  app.use(log())
}

app.model(require('./models/app'))

app.router((route) => [
  route('/', require('./pages/home'))
])

const tree = app.start()

document.body.appendChild(tree)
