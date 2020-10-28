const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: path.join(__dirname, './src/index.ts'),
    worker: path.join(__dirname, './src/worker/index.ts')
  },
  output: {
    path: path.join(__dirname, '/dist/'),
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
  },
  plugins: [
    new (require('html-webpack-plugin'))({
      template: './src/index.html',
      inject: false
    })
  ]
};
