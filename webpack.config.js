const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: {
    app: ['./src/main.js', './src/components/layout'],
    vendor: ['es6-promise/auto', 'lodash', 'jquery', 'swiper', 'helper', 'whatwg-fetch', 'config']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js',
    chunkFilename: '[name]-[chunkhash:8].js'
  },
  externals: {
    BMap: 'window.BMap'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue!eslint'
      }, {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: [/node_modules/, path.resolve(__dirname, './src/modules/')]
      }, {
        test: /\.(css|styl)$/,
        loader: 'style!css!postcss!stylus',
        exclude: /node_modules/
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash:8]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname, './src/modules/jquery'),
      config: path.resolve(__dirname, './src/config'),
      methods: path.resolve(__dirname, './src/methods'),
      components: path.resolve(__dirname, './src/components'),
      assets: path.resolve(__dirname, './src/assets')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/res': {
        target: 'http://h5test.uhuibao.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/res' : '/res'
        }
      }
    }
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].bundle.js'
    }),
    new webpack.LoaderOptionsPlugin({
      vue: {
        postcss: [require('autoprefixer')()]
      }
    }),
    new StyleLintPlugin({
      syntax: 'scss',
      files: ['**/*.css', '**/*.styl']
    })
  ]
};
