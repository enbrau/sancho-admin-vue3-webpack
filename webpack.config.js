const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const packageName = require('./package.json').name

const env = require('dotenv').config({path: __dirname + `/.env.${process.env.NODE_ENV}`})
const settings = require('./settings.js')

const mockServer = require('./mock-server.js')

const subApps = require('./sub-apps.js')
const subAppProxy = {}
for (const subApp of subApps) {
  subAppProxy[subApp.contextPath] = {
    target: subApp.entry.replace(subApp.contextPath + '/', ''),
    changeOrigin: true,
    ws: true,
    secure: false,
    logLevel: 'debug'
  }
}

module.exports = {
  entry: './src/main.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    library: `{packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    // filename: 'assets/[name].[contenthash].js',
    // chunkFilename: 'assets/bundle-[name].[contenthash].js',
    // assetModuleFilename: 'assets/[name][ext]'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env.parsed),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public', 
        to: ''
      }]
    }),
    new HtmlWebpackPlugin({
      title: settings.title,
      template: 'index.html'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            exclude: [
              /node_modules[\\\/]core-js/,
              /node_modules[\\\/]webpack[\\\/]buildin/
            ],
            presets: [['@babel/preset-env', {
              useBuiltIns: 'usage',
              corejs: 3
            }]]
          }
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
              maxSize: 6 * 1024,
          }
        },
        exclude: path.resolve(__dirname, './src/icons')
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, './src/icons'),
        options: {
          symbolId: 'icon-[name]'
        }
      }
    ]
  },
  devServer: {
    static: __dirname + '/public/',
    host: '127.0.0.1',
    port: 9527,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (env.parsed.NODE_ENV === 'development') {
        mockServer(devServer.app)
      }
      return middlewares
    },
    proxy: {
      ...subAppProxy,
      [process.env.CONTEXT_PATH]: {
        target: process.env.HOST,
        changeOrigin: true,
        ws: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: { '/mock': '' },
        onProxyReq:function (proxyReq, req, res, options) {
          if (req.body) {
            let bodyData = JSON.stringify(req.body);
            // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
            proxyReq.setHeader('Content-Type','application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            // stream the content
            proxyReq.write(bodyData);
          }
        }
      }
    }
  }
}
