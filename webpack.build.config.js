const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');

config.devtool = '#source-map';
config.plugins = (config.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
]);

switch (process.env.NODE_ENV) {
  case 'debug' :
    config.output.publicPath = 'http://js.uhuibao.cn/project/h5_uhuibao/v2/dist/';
    config.output.path = path.resolve(__dirname, './dist');
    break;

  case 'test' :
    config.output.publicPath = 'http://jstest.uhuibao.net/project/h5_uhuibao/v2/dist/';
    config.output.path = path.resolve(__dirname, './build/test/dist');
    break;

  case 'rctest' :
    config.output.publicPath = 'http://jstest.uhuibao.com/project/h5_uhuibao/v2/dist/';
    config.output.path = path.resolve(__dirname, './build/rctest/dist');
    break;

  case 'release' :
    config.output.publicPath = 'http://js.uhuibao.com/project/h5_uhuibao/v2/dist/';
    config.output.path = path.resolve(__dirname, './build/release/dist');
    break;
};

module.exports = config;
