// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { ReactLoadablePlugin } = require('react-loadable/webpack')
const antdTheme = require('../src/antdTheme') // <- Include variables to override antd theme

const devMode = process.env.NODE_ENV !== 'production';

// const extractLess = new ExtractTextPlugin({
//   filename: 'static/css/[name].[contenthash].css',
//   disable: devMode, // disable this during development
// })

const extractCss = new MiniCssExtractPlugin({
  filename: devMode ? 'static/css/[name].css' : 'static/css/[name].[hash].css',
  chunkFilename: devMode ? 'static/css/[id].css' : 'static/css/[id].[hash].css',
});

const miniExtractPlugin = {
  test: /\.less$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "less-loader",
  ]
};

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
      !devMode ? miniExtractPlugin : {}, 
      // {
      //   test: /\.less$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     "less-loader",
      //   ]
      // },
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
  ],
})
