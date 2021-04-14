const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

// env
const env = require("../env");

module.exports = {
  mode: "production",
  entry: {
    app: "./src/index.tsx"
  },
  devtool: "source-map",
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.CLIENT_URL": JSON.stringify("http://localhost:3000"),
      "process.env.API_URL": JSON.stringify("http://localhost:3000/dev")
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss|less)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'sass-loader'
        },
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
              modifyVars: {
                'font-family': "'Open Sans', -apple - system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans- serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                'primary-color': '#fe0080',
                'heading-color': '#fe0080',
                'black': '#111111',
                'text-color': '#666666',
                'link-color': '#fe0080',
                'layout-body-background': '#ffffff',
                'layout-header-background': 'transparent',
                'layout-footer-background': '#25252a',
                'layout-footer-padding': '42px 50px',
                'layout-header-height': '100px',
                'layout-header-color': '#111111',
                'heading-color': '#111111',
                'heading-1-size': '96px',
                'heading-2-size': '48px',
                'menu-item-color': '#111111',
                'border-radius-base': '4px',
                'box-shadow-base': '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
                'card-shadow': '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
                // Border color
                'border-color-base': '#FF9191',
                'order-color-split': '#FF9191',
                // Card
                'card-head-font-size': '48px',
                // Button
                'btn-font-weight': '600',
                'error-color': '#ee1911'
              },
              javascriptEnabled: true,
            },
          },
        }],
      },
      {
        test: /\.(png|svg|jpg|gif|mp3)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  }
};
