const path = require('path');
const webpack = require('webpack');
const buildPath = path.resolve(__dirname, 'public');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000/',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    sourceMapFileName: 'js/bundle.js.map', //Filename
    path: buildPath, //Path where the bundle should be exported
    filename: 'js/bundle.js', //Filename
    publicPath: '/' //Where the js gets loaded from
  },
  //devtool: 'source-map',
  devtool: 'eval-source-map',
  cache: false,
  module: {
    preLoaders: [
      {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: 'json'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          'css-loader',
          'less-loader',
          'postcss-loader'
        ],
        include: path.join(__dirname, 'src', 'Less')
      },
      {
        test: /\.(png|jpg|jpeg|svg|woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extenstions: ['', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/Template/template.html',
      inject: 'body',
      hash: true,
      cache: true,
      showErrors: false
    })
  ]
};
