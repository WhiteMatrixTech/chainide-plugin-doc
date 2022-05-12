const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectBodyPlugin = require('inject-body-webpack-plugin').default;

module.exports = {
  mode: 'development',
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client',
    './src/extension.ts'
  ],

  output: {
    path: path.resolve(__dirname, 'out'),
    libraryTarget: 'system',
    publicPath: '',
    clean: true
  },

  devServer: {
    contentBase: path.join(__dirname, 'template/'),
    hot: true,
    historyApiFallback: true,
    inline: true,
    open: true,
    injectClient: false,
    port: process.env.PORT,
    clientLogLevel: 'silent',
    headers: { 'Access-Control-Allow-Origin': '*' }
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      base: '/',
      template: './template/s/index.html'
    }),
    new InjectBodyPlugin({
      content: `<script>
      localStorage.setItem('devPluginInfo', JSON.stringify({
        url: 'http://localhost:${process.env.PORT}/main.js'
      }));
      </script>`
    })
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/]
      },
      {
        test: /.(less|css)$/,

        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  },

  externalsType: 'system',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'office-ui-fabric-react': 'Fabric',
    chainIDE: 'chainIDE'
  }
};
