/**
 * @name build
 * @author Lester
 * @date 2021-05-11 11:05
 */
'use strict';

process.env.NODE_ENV = 'production';

// 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const ora = require('ora');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin'); // 简单打包进度百分比
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js压缩
const webpackConfig = require('./webpack.config');

const buildConfig = {
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new SimpleProgressWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'async', // initial、async和all
      minSize: 30000, // 形成一个新代码块最小的体积
      automaticNameDelimiter: '-', // 打包分割符
      name: 'name',
      cacheGroups: {
        commons: {
          name: 'vendor',
          chunks: 'initial',
          minChunks: 2
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
            ascii_only: true
          },
          compress: {
            drop_console: false,
            drop_debugger: true,
            comparisons: false
          },
          safari10: true
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};

const compiler = webpack(merge(webpackConfig(), buildConfig));

const formatSize = size => {
  if (size > 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MiB`;
  }
  if (size > 1024) {
    return `${(size / 1024).toFixed(1)} KiB`;
  }
  return `${size} bytes`;
};

const spinner = ora('Build...');
spinner.start();

compiler.run((err, stats) => {
  if (err) {
    spinner.fail();
    throw err;
  } else {
    spinner.succeed();
    console.log(chalk.greenBright(stats.toJson().assets.map(item =>
      `${item.name} ${formatSize(item.size)} ${item.isOverSizeLimit ? 'overSizeLimit' : ''} \n`).join('')));
  }
});
