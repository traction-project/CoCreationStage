const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
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
};
