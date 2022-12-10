const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  mode:"development",
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};