const WebpackDevServer = require('webpack-dev-server');
const config = require("./webpack.dev.js");
var webpack = require('webpack');
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    'contentBase': path.resolve(ROOT_PATH, 'public'),//Where static content should be serverd
    'publicPath': '/js/',//Virtual link for the bundle
    'hot': true,
    'historyApiFallback': true //Fixes refresh problem
});
server.listen(3000);
