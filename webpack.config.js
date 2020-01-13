const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['webpack-hot-middleware/client', './client/index.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebPackPlugin({
      filename: './index.html',
      template: './public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
            exclude: /node_modules/,
          },
        },
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      }
    ],
  },
}
