var webpack = require('webpack');

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: "./dist",
    publicPath: "/dist/",
    filename: "app.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        query: {
          "presets": [
            "es2015-loose",
          ],
          "plugins": [
            "transform-runtime",
            ["transform-es2015-modules-commonjs-simple", {
              addExports: true
            }],
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "vue-html-loader",
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports.output.filename = "app.min.js",
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
  ];
} else {
  module.exports.devtool = '#source-map'
}
