const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    state: './src/index.js',
    county: './src/pageTwo.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
