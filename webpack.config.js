const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

const sourcePath = path.resolve(__dirname, 'source');
const distPath = path.resolve(__dirname, 'dist');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      moment: "moment",
    }),
    new HtmlWebPackPlugin({
      template: sourcePath + '/index.html'
    }),
    new CopyWebpackPlugin([
      {from: 'static'},
      {from: 'deploy.config'},
      {from: 'views', to: distPath + '/views'},
    ])
  ];

  plugins.push(new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin());

  const config = {
    entry: {
      app: sourcePath + '/main.ts',
    },
    output: {
      path: distPath,
      filename: '[name].bundle.[hash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: { minimize: true }
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: sourcePath + '/../tsconfig.json',
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath
      ]
    },
    plugins,
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    // devtool: 'eval-source-map',
    devServer: {
      contentBase: distPath,
      hot: true,
      port: 3000,
      historyApiFallback: {
        index: 'index.html'
      }
    }
  };

  if (!isProd) {
    config.devtool = 'source-map';
  }

  return config;
};
