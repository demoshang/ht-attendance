/* eslint-disable @typescript-eslint/no-require-imports */
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.config.common.js');

const IS_ANALYSIS = false;

const plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!.git'],
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('production'),
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/pages/production.html',
        to: './index.html',
      },
    ],
  }),
];

if (IS_ANALYSIS) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    concatenateModules: !IS_ANALYSIS,

    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: true,
          toplevel: true, // 最高级别，删除无用代码
          ie8: false,
          safari10: true,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'resolve-url-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins,
});
