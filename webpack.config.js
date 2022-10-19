/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
