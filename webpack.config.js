const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/demo/pointsPlayer/demoPointsPlayer.ts',
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
    filename: 'demoPointsPlayer.js',
    path: path.resolve(__dirname, 'demo/points/')
  },
  plugins: [
    new HtmlWebpackPlugin({      // Instancie le plugin
      template: "./src/demo/pointsPlayer/player.html"  // Spécifie notre template
    })
  ]
};