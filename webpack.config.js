var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssnext           = require('postcss-cssnext');
var autoprefixer       = require('autoprefixer');
var postcssSVG        = require('postcss-svg');
var cssnano           = require('cssnano');
// var atImport          = require('postcss-import');
// var CompressionPlugin = require('compression-webpack-plugin');

var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV || 'development';


module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname + '/dist',
    //filename: "[chunkhash:6].js"
    filename: 'common.js'
  },

  resolve: {
    extensions: ['', '.js', '.css']
  },

  watch: NODE_ENV == 'development',

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.sss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss?pack=minimize!postcss?pack=compile&parser=sugarss')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss?pack=minimize!postcss?pack=compile')
      },
      { test: /\.png$/, loader: 'url?limit=100000' },
      { test: /\.gif/, loader: 'url?limit=100000' },
      { test: /\.svg/, loader: 'url?limit=100000' },
      { test: /\.jpg$/, loader: 'file?name=images/[name].[ext]' }
    ]
  },

  plugins: [
        new webpack.EnvironmentPlugin('NODE_ENV'),
        new ExtractTextPlugin('styles.css'),
        /*new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css/,
            threshold: 10240,
            minRatio: 0.8
        })*/
        /*new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      }),*/
    ],
  postcss: function (webpack) {
      return {
        compile: [
          require('postcss-import')({ addDependencyTo: webpack }),
          autoprefixer({ browsers: ['>1%'] }),
          cssnext,
          postcssSVG({
            // paths: ['./public/image'],
            svgo: true
          })
        ],
        minimize: NODE_ENV == 'development' ? [] : [
          cssnano({
            autoprefixer: false,
            discardComments: { removeAll: true },
            zindex: false,
            reduceIdents: false
          })
        ],
      };
  }
};

if(NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      },
      comments: false,
      sourcemap: false,
      beautify: false,
      dead_code: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  );
}
