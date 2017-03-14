var path = require('path');
var webpack = require('webpack');
var buildPath = path.resolve(__dirname, 'public', 'js');


module.exports = {
	entry: ['./src/index'],
	output: {
		path: buildPath, //Path where the bundle should be exported
		filename: 'bundle.js', //Filename
		publicPath: '/js/' //Where the js gets loaded from
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
		loaders: [{
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
		}]
	},
	resolve: {
		root: path.resolve('./src'),
		extenstions: ['', '.js']
	},
	plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
           compressor: {
               warnings: false,
               screw_ie8: true
           }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        });
	]
}
