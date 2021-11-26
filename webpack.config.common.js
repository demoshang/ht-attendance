/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/pages/index.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$|\.ts$|\.tsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'dist/static/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/static/',
          to: './static/',
        },
      ],
    }),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
