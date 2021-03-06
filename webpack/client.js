// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { ReactLoadablePlugin } = require('react-loadable/webpack')
const antdTheme = require('../src/antdTheme') // <- Include variables to override antd theme

const devMode = process.env.NODE_ENV !== 'production';

// const extractLess = new ExtractTextPlugin({
//   filename: 'static/css/[name].[contenthash].css',
//   disable: devMode, // disable this during development
// })

const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const extractCss = new MiniCssExtractPlugin({
  filename: devMode ? 'static/css/[name].css' : 'static/css/[name].[hash].css',
  chunkFilename: devMode ? 'static/css/[id].css' : 'static/css/[id].[hash].css',
});

const compression = devMode ? [] : [
  new CompressionPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.7
  }),
  new CompressionPlugin({
    filename: '[path].gzip[query]',
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.7
  }),
  new BrotliPlugin({
    asset: '[path].br[query]',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.7
  }),
];

module.exports = (config, webpack) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [['import', { libraryName: 'antd', style: "css" }]],
        },
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ]
      },
      // {
      //   test: /\.less$/,
      //   // use the ExtractTextPlugin instance
      //   use: extractLess.extract({
      //     use: [
      //       {
      //         loader: 'css-loader',
      //       },
      //       {
      //         loader: 'less-loader',
      //         options: {
      //           modifyVars: antdTheme,
      //         },
      //       },
      //     ],
      //     // use style-loader in development
      //     fallback: 'style-loader',
      //   }),
      // },
    ],
  },
  plugins: [
    ...config.plugins,
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    }),
    // extractLess, // <- Add the ExtractTextPlugin instance here
    extractCss,
    ...compression,
  ],
})
