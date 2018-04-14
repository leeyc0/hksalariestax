const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    "babel-polyfill",
    "./src/index.js",
  ],
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: "pre",
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          extractCSS: true,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          minimize: true,
        },
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
  ],
};