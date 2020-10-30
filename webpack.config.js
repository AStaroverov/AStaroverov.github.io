const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const p = (str) => path.join(__dirname, str);

module.exports = {
  mode: 'development',
  entry: {
    main: p('./src/index.ts'),
    worker: p('./src/worker/index.ts')
  },
  output: {
    path: p('/dist/'),
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
    new HtmlPlugin({
      template: './src/index.html',
      inject: false
    }),
    new CopyPlugin({
      patterns: [
        { from: p('lib/Pxxl/fonts/'), to: 'fonts/' }
      ]
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
};
