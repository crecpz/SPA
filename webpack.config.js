const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          "style-loader",
          // 将 CSS 转化成 CommonJS 模块
          "css-loader",
          // 将 Sass 编译成 CSS
          "sass-loader",
        ],
      },
      {
        // babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
    open: true,
    compress: true,
    hot: true,
  },
  mode: "production",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
