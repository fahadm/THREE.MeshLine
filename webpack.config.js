const path = require('path');

module.exports = {
	entry: './src/index.ts',
	externals: ['three'],

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'meshline.js',
		library: 'meshline',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
};
