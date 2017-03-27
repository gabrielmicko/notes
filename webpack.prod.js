var path = require('path');
var webpack = require('webpack');
var buildPath = path.resolve(__dirname, 'public');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['./src/index'],
	output: {
		path: buildPath, //Path where the bundle should be exported
		filename: 'js/bundle.[hash].js', //Filename
		publicPath: '/' //Where the js gets loaded from
	},
	eslint: {
		configFile: '.eslintrc',
		failOnWarning: true,
		failOnError: true
	},
	module: {
		preLoaders: [{
			test: /\.json$/,
			exclude: /(node_modules)/,
			loader: 'json'
		}],
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel-loader'],
				include: path.join(__dirname, 'src'),
				exclude: /(node_modules|bower_components)/
			}, {
				test: /\.less$/,
				loaders: ['style-loader', 'css-loader', 'less-loader'],
				include: path.join(__dirname, 'src', 'Less')
			},
			{
				test: /\.(png|jpg|jpeg|svg|woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
		]
	},
	resolve: {
		root: path.resolve('./src'),
		extenstions: ['', '.js']
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
			},
			compressor: {
				warnings: false,
				screw_ie8: true
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
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
}
