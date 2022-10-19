const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const frontend = {
  devtool: "source-map",
  mode:"production",
  entry: './orkestraApp/src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './backend/static/app/traction'),
  },
   module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            reserved: ['Mosaic',"Divided","EditLayout","CustomLayout"], // <-- list reserved words here
          },
        },
      }),
    ],
  }, 
   plugins: [
    new HtmlWebpackPlugin({
      template: './orkestraApp/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: "./orkestraApp/locale", to: "locale" },
      ],
    }),
 ]
}



module.exports = [frontend];
