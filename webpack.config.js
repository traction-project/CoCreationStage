const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const frontend = {
  entry: './orkestraApp/src/app.js',
  devtool: "source-map",
  mode:"production",
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

const backend = {
  mode: "development",
  target: "node",
  node: {
    __dirname: true,
  },
  externals: [nodeExternals()],
  entry: {
    backend: "./index.js",
  },
  output: {
    path: __dirname + "/bin",
    filename: "[name].js",
    libraryTarget: 'commonjs'
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude:  /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = [backend, frontend];
