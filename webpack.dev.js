const path = require('path');
const webpack = require('webpack');
const buildPath = path.resolve(__dirname, 'public', 'js');

module.exports = {
  entry: ['webpack-dev-server/client?http://0.0.0.0:3000/', 'webpack/hot/only-dev-server', 'react-hot-loader/patch', './src/index'],
	output: {
		path: buildPath, //Path where the bundle should be exported
		filename: 'bundle.js', //Filename
		sourceMapFileName: 'bundle.map', //Filename
		publicPath: '/js/' //Where the js gets loaded from
	},
	devtool: 'eval',
	cache: false,
	module: {
		preLoaders: [{
			test: /\.json$/,
			exclude: /(node_modules)/,
			loader: 'json'
		}],
		loaders: [{
			test: /\.jsx?$/,
			loaders: ['babel-loader'],
			include: path.join(__dirname, 'src'),
			exclude: /(node_modules|bower_components)/
		}, {
			test: /\.less$/,
			loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
			include: path.join(__dirname, 'src', 'Less')
		},
		{
			test: /\.(png|jpg|jpeg|svg|woff|woff2|eot|ttf|otf)$/,
			loader: 'url-loader'
		}]
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
        })
	]
}
