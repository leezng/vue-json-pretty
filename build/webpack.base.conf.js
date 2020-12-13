const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const utils = require('./utils');
const config = require('../config');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const isProd = process.env.NODE_ENV === 'production';

const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader';

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: !isProd,
    esModule: false,
  },
};

module.exports = {
  entry: {
    app: './example/main.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
    alias: {
      src: resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.[t|j]s[x]?$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('example'), resolve('test')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.css$/,
        use: [styleLoader, cssLoader],
      },
      {
        test: /\.less$/,
        use: [
          styleLoader,
          cssLoader,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
      emitError: true,
      emitWarning: true,
    }),
    new VueLoaderPlugin(),
  ],
};
