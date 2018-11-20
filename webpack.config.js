const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/demo/demoSpectrumPlayer.ts',
  devtool: "source-map",
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
    path: path.resolve(__dirname, 'demo')
  },
  plugins: [
    new HtmlWebpackPlugin({      // Instancie le plugin
      template: "./src/demo/spectrumPlayer.html"  // Spécifie notre template
    })
  ]
};