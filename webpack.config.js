const path = require('path');

module.exports = {
  entry: './src/demo/demoSpectrumPlayer.ts',
  module: {
    rules: [
                {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'demoSpectrumPlayer.js',
    path: path.resolve(__dirname, 'dist')
  },
};