const TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'build:dev' || TARGET === 'dev' || !TARGET) {
  module.exports = require('./config/webpack.config.dev');
  console.info('--> ./config/webpack.config.dev.js');
}
else if (TARGET === 'build' || TARGET === 'build:prod') {
  console.info('--> ./config/webpack.config.prod.js');
  module.exports = require('./config/webpack.config.prod');
}
else if (TARGET === 'stats') {
  module.exports = require('./config/webpack.config.stats');
}