'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const { merge } = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.productionSourceMap,
      usePostCSS: true
    })
  },
  devtool: config.dev.devtool,
  output: {
    path: config.dev.assetsRoot,
    filename: utils.assetsPath('[name].[hash].js'),
    chunkFilename: utils.assetsPath('[name].[hash].js'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups : {
        node_module : {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('[name]/css/[name].[contenthash].css'),
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.dev.productionSourceMap
        ? { safe: true, map: {inline: false} }
        : { safe: true }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
})

if (config.dev.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  devWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      assetsPath: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.dev.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.dev.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  devWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = devWebpackConfig
