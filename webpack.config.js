const path = require('path');

module.exports = {
  mode: "development",
  entry: [path.join(__dirname, './src/index.ts')],
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }],
  },
};
