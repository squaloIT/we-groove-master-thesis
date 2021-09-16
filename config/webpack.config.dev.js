const path = require('path');
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Workbox = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-nosources-cheap-source-map', //This gives me nice dev tools experience
  // devtool: 'inline-source-map', //This gives me nice dev tools experience
  entry: {
    script: path.resolve(__dirname, './../app/js/script.js'),
  },
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, './../app'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, './../app'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './../.env.development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './../app/assets'),
          to: path.resolve(__dirname, './../dist/assets'),
        },
        {
          from: path.resolve(__dirname, './../manifest.webmanifest'),
          to: path.resolve(__dirname, './../dist/manifest.webmanifest'),
        },
        // {
        //   from: path.resolve(__dirname, './../sw.js'),
        //   to: path.resolve(__dirname, './../../server/dist/sw.js'),
        // },
      ]
    }),
    // new Workbox.InjectManifest({
    //   swSrc: path.resolve(__dirname, './../sw.js'),
    //   swDest: 'service-worker.js',
    // }),
  ],
};