const path = require("path");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
  entry: {
    app: path.join(__dirname, "src/client/index.tsx"),

  },
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  performance: {
    maxEntrypointSize: 400000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin()
    ],
  },
  cache: {
    type: 'filesystem',
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build/client"),
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: path.join(__dirname, "src/client/index.html"),
    }),
    new WebpackBar({
      name: "Youtube MP3 Downloader",
    }),
    new MiniCssExtractPlugin()
  ],
};
