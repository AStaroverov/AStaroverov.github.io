const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: path.join(__dirname, './examples/index.ts'),
    squares: path.join(__dirname, './examples/squares.ts'),
    triangles: path.join(__dirname, './examples/triangles.ts')
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
