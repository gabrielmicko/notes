if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root.prod');
} else {
  console.log('Ran once');
  module.exports = require('./Root.dev');
}
