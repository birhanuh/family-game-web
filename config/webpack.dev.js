const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.tsx"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    port: 3000,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
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
        },
        { loader: 'sass-loader' },
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
                'heading-1-size': '64px',
                'heading-2-size': '48px',
                'menu-item-color': '#111111',
                'border-radius-base': '4px',
                'box-shadow-base': '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
                'card-shadow': '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
                // Border color
                'border-color-base': '#FF9191',
                'order-color-split': '#FF9191',
              },
              javascriptEnabled: true,
            },
          },
        }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  }
};
