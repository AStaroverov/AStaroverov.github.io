const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: path.join(__dirname, './src/index.ts'),
    worker: path.join(__dirname, './src/worker.ts')
  },
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  }
};
