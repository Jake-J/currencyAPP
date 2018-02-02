const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
 
const AppDir = path.resolve(__dirname,'src'),
      pubDir = path.resolve(__dirname, 'public');

module.exports = {
 entry: AppDir + '/scripts/app.js',
 output: {
   filename: 'bundle.js',
   path: pubDir
 },
 module: {
   rules: [
    {
      test: [/\.(sass|scss|css)$/],
      use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader",'sass-loader']
        })
    },
    {
      test: /\.js$/,
      exclude:/node_modules/,
      use: 'babel-loader'
    },
    {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use:[
            {
              loader:'file-loader',
              options: {
                name:'[name].[ext]',
                outputPath: 'img/'
              }
            }
          ]
    },
    {
      test: /\.html$/,
      use: ['html-loader']
    },
    {
      test: /\.php$/,
      loaders: [
        'html-minify',
        'php-loader'
      ]
    }
   ]
 },
 plugins: [
     new ExtractTextPlugin({
      filename:'app.css',
      disable: false,
      allChunks: true
  }),
  new BrowserSyncPlugin({
    // browse to http://localhost:3000/ during development, 
    // ./public directory is being served 
    host: 'localhost',
    port: 4000,
    server: { baseDir: ['public'] }
  }),
  new HtmlWebpackPlugin({
    title: 'portfolio',
    minify: {
        collapseWhitespace:true
    },
    hash:true,
    template: './src/my-index.html' // Load a custom template (lodash by default see the FAQ for details)
  }),
  new CleanWebpackPlugin(['public'])
 ]
};