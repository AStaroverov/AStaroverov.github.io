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
      {
        test: /node_modules.*\.css$/g,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader",
        exclude: /node_modules/
      },
      {
        test: /\.sss$/,
        loader: "style-loader!css-loader!postcss-loader?parser=sugarss",
        exclude: /node_modules/
      },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  },
  postcss: function() {
    return [
      require('postcss-nested'),
      require('autoprefixer'),
    ]
  }
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
