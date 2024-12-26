const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

// env
//const env = require("../env");

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.tsx',
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.CLIENT_URL': JSON.stringify('https://family-game.netlify.app'),
      'process.env.API_URL': JSON.stringify('https://ns8tz7m7v1.execute-api.eu-west-1.amazonaws.com'),
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss|less)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|mp3)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
};
