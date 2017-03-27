const WebpackDevServer = require('webpack-dev-server');
const config = require("./webpack.prod.js");
var webpack = require('webpack');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    'contentBase': path.resolve(ROOT_PATH, 'public'),//Where static content should be serverd
    'publicPath': '/',//Virtual link for the bundle
    'historyApiFallback': true //Fixes refresh problem
});
server.listen(3000);
